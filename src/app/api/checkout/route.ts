import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const priceId = process.env.STRIPE_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!priceId) {
    return NextResponse.json(
      { error: "Serverkonfigurationsfel." },
      { status: 500 },
    );
  }

  // Läs referral-token om den skickades med
  let referralToken: string | null = null;
  try {
    const body = await req.json();
    referralToken = body?.referralToken ?? null;
  } catch {
    // Tom body är OK
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/rapport?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/rapport?cancelled=true`,
      ...(referralToken
        ? { metadata: { referral_token: referralToken } }
        : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[checkout] Stripe error:", err);
    return NextResponse.json(
      { error: "Kunde inte starta betalningen. Försök igen." },
      { status: 500 },
    );
  }
}
