import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, buildUserPrompt } from "@/lib/prompts";
import { formatBenchmarksForPrompt } from "@/lib/benchmarks";
import { checkRateLimit } from "@/lib/rate-limit";
import { resolveSSYK } from "@/lib/jobtech";
import { getSalaryBySSYK, formatSalaryForPrompt } from "@/lib/scb-salary";
import type { AnalysisResult } from "@/lib/analysis-types";
import { validateAnalysisResult } from "@/lib/analysis-validation";

const MAX_TEXT_LENGTH = 50_000;

export async function POST(req: NextRequest) {
  // Rate limiting — max 5 analyser per IP per timme
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, remaining } = await checkRateLimit(ip, "analyze");
  if (!allowed) {
    return NextResponse.json(
      { error: "Du har nått gränsen för antal analyser. Försök igen om en timme." },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Serverkonfigurationsfel. Försök igen senare." },
      { status: 500 }
    );
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Ogiltig förfrågan." },
      { status: 400 }
    );
  }

  const text = body.text;
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return NextResponse.json(
      { error: "Ingen avtalstext skickades." },
      { status: 400 }
    );
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: "Avtalstexten är för lång. Max 50 000 tecken." },
      { status: 400 }
    );
  }

  // Benchmarks + lönedata (parallellt)
  const allBenchmarks = ["tjänsteman", "tekniker", "ledare"]
    .map((k) => {
      const benchText = formatBenchmarksForPrompt(k);
      return benchText ? `[${k}]\n${benchText}` : "";
    })
    .filter(Boolean)
    .join("\n\n");

  // Försök extrahera yrkestitel från avtalstexten och hämta SCB-lönedata
  // Kör parallellt — ska inte blockera om API:erna är nere
  let salaryContext = "";
  try {
    // Enkel heuristik: leta efter yrkestitel i avtalets text
    const titleMatch = text.match(
      /(?:befattning|tjänst|yrkestitel|roll|position)[:\s]+([^\n,.;]{3,40})/i,
    );
    const jobTitle = titleMatch?.[1]?.trim();

    if (jobTitle) {
      const ssyk = await resolveSSYK(jobTitle);
      if (ssyk) {
        const salary = await getSalaryBySSYK(ssyk.ssyk);
        if (salary && salary.median > 0) {
          salaryContext = `\nLÖNESTATISTIK (SCB, officiell, CC BY 4.0 — använd i analysen om lön nämns i avtalet):\n${formatSalaryForPrompt(salary)}\n`;
        }
      }
    }
  } catch {
    // Tyst fel — lönedata är en bonus, inte ett krav
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(text.slice(0, MAX_TEXT_LENGTH)),
        },
      ],
      system: buildSystemPrompt(allBenchmarks + salaryContext),
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Något gick fel. Försök igen." },
        { status: 500 }
      );
    }

    // Försök parsa JSON — Claude kan ibland wrappa i markdown
    let jsonText = content.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }

    let result: AnalysisResult;
    try {
      result = JSON.parse(jsonText);
    } catch {
      // Logga server-side för debugging, visa generiskt fel till användare
      // eslint-disable-next-line no-console
      console.error("[analyze] Invalid JSON from Claude:", jsonText.slice(0, 500));
      return NextResponse.json(
        { error: "Något gick fel vid analys. Försök igen." },
        { status: 500 }
      );
    }

    // Validera att kritiska fält finns
    if (!result.flaggor || !Array.isArray(result.flaggor)) {
      return NextResponse.json(
        { error: "Analysen kunde inte genomföras korrekt. Försök igen." },
        { status: 500 }
      );
    }

    // Strukturell validering — logga avvikelser men blockera inte
    const validation = validateAnalysisResult(result);
    if (!validation.valid) {
      // eslint-disable-next-line no-console
      console.error("[analyze] Validation errors:", validation.errors);
    }

    return NextResponse.json({ result });
  } catch (err: unknown) {
    const isTimeout =
      err instanceof Error && err.message.includes("timeout");
    if (isTimeout) {
      return NextResponse.json(
        { error: "Analysen tog för lång tid. Försök igen." },
        { status: 504 }
      );
    }

    // eslint-disable-next-line no-console
    console.error("[analyze] API error:", err);
    return NextResponse.json(
      { error: "Något gick fel. Försök igen om en stund." },
      { status: 500 }
    );
  }
}
