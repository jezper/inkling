"use client";

import { useEffect } from "react";
import { storeReferralFromUrl } from "@/lib/referral";

/** Fångar ?ref= från URL och sparar i localStorage. Renderar inget. */
export function ReferralCapture() {
  useEffect(() => {
    storeReferralFromUrl();
  }, []);
  return null;
}
