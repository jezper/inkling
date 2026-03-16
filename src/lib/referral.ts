import { createHmac } from "crypto";

/**
 * Server-side: generera referral-token från rapport-token.
 * Signerad med HMAC-SHA256 — kan inte fabriceras utan hemligheten.
 */
export function generateReferralToken(reportToken: string): string {
  const secret = process.env.REFERRAL_HMAC_SECRET;
  if (!secret) throw new Error("REFERRAL_HMAC_SECRET is not set");

  const payload = `${reportToken}:referral:${Math.floor(Date.now() / 86400000)}`; // dagsgranulär
  return createHmac("sha256", secret)
    .update(payload)
    .digest("base64url")
    .slice(0, 16); // kort nog för URL, unikt nog för tracking
}

/**
 * Client-side helpers — körs i webbläsaren.
 */

const STORAGE_KEY = "ka_ref";
const TTL_MS = 72 * 60 * 60 * 1000; // 72 timmar

/** Spara referral-token från ?ref= i localStorage */
export function storeReferralFromUrl(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (!ref) return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ token: ref, ts: Date.now() }),
  );

  // Rensa ?ref= från URL
  const url = new URL(window.location.href);
  url.searchParams.delete("ref");
  window.history.replaceState({}, "", url.pathname + url.search + url.hash);
}

/** Hämta giltig referral-token (inom 72h TTL) */
export function getReferralForCheckout(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const { token, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return token;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}
