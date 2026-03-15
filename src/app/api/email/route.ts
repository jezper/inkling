import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { createReportToken } from "@/lib/report-token";
import { buildReportEmail } from "@/lib/email-template";
import type { AnalysisResult } from "@/lib/analysis-types";

export async function POST(req: NextRequest) {
  try {
    const { email, result } = (await req.json()) as {
      email?: string;
      result?: AnalysisResult;
    };

    if (!email || !result || !Array.isArray(result.flaggor)) {
      return NextResponse.json(
        { error: "Email och analysresultat krävs." },
        { status: 400 },
      );
    }

    // Validera email-format (basic)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ogiltig emailadress." },
        { status: 400 },
      );
    }

    // Skapa delbar rapport-länk
    const token = createReportToken(result);
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const reportUrl = `${siteUrl}/rapport?t=${token}`;

    // Skicka email
    const { error } = await resend.emails.send({
      from: "inkling <onboarding@resend.dev>",
      to: email,
      subject: `Din avtalsrapport — ${result.helhetsbedömning?.rubrik ?? "Analys klar"}`,
      html: buildReportEmail(result, reportUrl),
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[email] Resend error:", error);
      return NextResponse.json(
        { error: "Kunde inte skicka email. Försök igen." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[email] Error:", err);
    return NextResponse.json(
      { error: "Något gick fel." },
      { status: 500 },
    );
  }
}
