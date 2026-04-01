import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await checkRateLimit(ip, "refund");
  if (!allowed) {
    return NextResponse.json(
      { error: "Du har gjort för många förfrågningar. Försök igen senare." },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  try {
    const { reason, reportUrl, sessionId } = (await req.json()) as {
      reason?: string;
      reportUrl?: string;
      sessionId?: string;
    };

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json(
        { error: "Ange en mer utförlig anledning." },
        { status: 400 },
      );
    }

    // Skicka email till dig med all info
    const { error } = await resend.emails.send({
      from: "Kolla Avtalet <hej@kollaavtalet.nu>",
      to: "hej@kollaavtalet.nu",
      subject: `Återbetalningsförfrågan`,
      html: `
        <h2>Återbetalningsförfrågan</h2>
        <p><strong>Anledning:</strong></p>
        <p>${reason.replace(/\n/g, "<br>")}</p>
        <p><strong>Stripe Session:</strong> ${sessionId ?? "Okänd"}</p>
        ${reportUrl ? `<p><strong>Rapport:</strong> <a href="${reportUrl}">${reportUrl}</a></p>` : ""}
        <p><strong>Tidpunkt:</strong> ${new Date().toLocaleString("sv-SE")}</p>
        <hr>
        <p>Refundera via <a href="https://dashboard.stripe.com/test/payments">Stripe Dashboard</a>.</p>
      `,
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[refund] Email error:", error);
      return NextResponse.json(
        { error: "Kunde inte skicka förfrågan. Kontakta hej@kollaavtalet.nu." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[refund] Error:", err);
    return NextResponse.json(
      { error: "Något gick fel. Kontakta hej@kollaavtalet.nu." },
      { status: 500 },
    );
  }
}
