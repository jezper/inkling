import { kv } from "@vercel/kv";
import { createReportToken, decryptReportToken } from "./report-token";
import type { AnalysisResult } from "./analysis-types";

const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 dagar

/**
 * Genererar en kort rapport-ID och lagrar den krypterade rapporten i KV.
 * Returnerar kort ID (8 tecken).
 */
export async function createShortLink(result: AnalysisResult): Promise<string> {
  const token = createReportToken(result);
  const shortId = generateShortId();

  await kv.set(`report:${shortId}`, token, { ex: TTL_SECONDS });

  return shortId;
}

/**
 * Hämtar rapport från kort ID.
 */
export async function resolveShortLink(
  shortId: string,
): Promise<{ data: AnalysisResult; expiresAt: number } | null> {
  const token = await kv.get<string>(`report:${shortId}`);
  if (!token) return null;

  return decryptReportToken(token);
}

function generateShortId(): string {
  const chars = "abcdefghijkmnpqrstuvwxyz23456789"; // inga förväxlingsbara tecken (0/O, 1/l)
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}
