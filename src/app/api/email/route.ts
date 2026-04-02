import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { resend } from "@/lib/resend";
import { createReportToken } from "@/lib/report-token";
import { buildReceiptEmail } from "@/lib/email-template";
import { ReportPdfDocument } from "@/lib/report-pdf";
import { checkRateLimit } from "@/lib/rate-limit";
import type { AnalysisResult } from "@/lib/analysis-types";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await checkRateLimit(ip, "general");
  if (!allowed) {
    return NextResponse.json(
      { error: "Du har gjort för många förfrågningar. Försök igen senare." },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  try {
    const { email, result, sessionId } = (await req.json()) as {
      email?: string;
      result?: AnalysisResult;
      sessionId?: string;
    };

    if (!email || !result || !Array.isArray(result.flaggor)) {
      return NextResponse.json(
        { error: "Email och analysresultat krävs." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ogiltig emailadress." },
        { status: 400 },
      );
    }

    // Create report link — try short link first, fall back to long token
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    let reportUrl: string;
    try {
      const { createShortLink } = await import("@/lib/short-links");
      const shortId = await createShortLink(result);
      reportUrl = `${siteUrl}/r/${shortId}`;
    } catch {
      const token = createReportToken(result);
      reportUrl = `${siteUrl}/rapport?t=${token}`;
    }

    // Generate report PDF
    const pdfBuffer = await renderToBuffer(
      ReportPdfDocument({ data: result }),
    );

    // Build receipt email
    const date = new Date().toLocaleDateString("sv-SE");
    const html = buildReceiptEmail({
      reportUrl,
      sessionId: sessionId ?? "N/A",
      date,
    });

    // Send email with PDF attachment
    const { error } = await resend.emails.send({
      from: "Kolla Avtalet <hej@kollaavtalet.nu>",
      to: email,
      subject: `Kvitto och avtalsrapport — Kolla Avtalet`,
      html,
      attachments: [
        {
          filename: "Avtalsrapport.pdf",
          content: Buffer.from(pdfBuffer),
        },
      ],
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
