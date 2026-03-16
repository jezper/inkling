import { NextRequest, NextResponse } from "next/server";
import { createReportToken } from "@/lib/report-token";

export async function POST(req: NextRequest) {
  try {
    const { result } = await req.json();
    if (!result || !Array.isArray(result.flaggor)) {
      return NextResponse.json({ error: "Ogiltig data." }, { status: 400 });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Försök skapa kort länk via Vercel KV
    try {
      const { createShortLink } = await import("@/lib/short-links");
      const shortId = await createShortLink(result);
      return NextResponse.json({
        token: shortId,
        url: `${siteUrl}/r/${shortId}`,
      });
    } catch {
      // KV inte konfigurerat — fallback till lång token-URL
      const token = createReportToken(result);
      return NextResponse.json({
        token,
        url: `${siteUrl}/rapport?t=${token}`,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[rapport/token] Error:", err);
    return NextResponse.json(
      { error: "Kunde inte skapa länk." },
      { status: 500 },
    );
  }
}
