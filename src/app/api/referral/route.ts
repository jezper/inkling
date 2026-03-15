import { NextRequest, NextResponse } from "next/server";
import { generateReferralToken } from "@/lib/referral";

export async function POST(req: NextRequest) {
  try {
    const { reportToken } = await req.json();
    if (!reportToken || typeof reportToken !== "string") {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const referralToken = generateReferralToken(reportToken);
    return NextResponse.json({ referralToken });
  } catch {
    return NextResponse.json(
      { error: "Kunde inte skapa delningslänk." },
      { status: 500 },
    );
  }
}
