import {
  createHmac,
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "crypto";
import { deflateSync, inflateSync } from "zlib";
import type { AnalysisResult } from "./analysis-types";

const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dagar

function getKey(): Buffer {
  const secret = process.env.REPORT_SECRET;
  if (!secret) throw new Error("REPORT_SECRET is not set");
  return createHmac("sha256", secret)
    .update("report-encryption-key")
    .digest();
}

export function createReportToken(data: AnalysisResult): string {
  const payload = JSON.stringify({ d: data, e: Date.now() + TTL_MS });
  const compressed = deflateSync(payload, { level: 9 });
  const iv = randomBytes(12);
  const key = getKey();
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(compressed),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function decryptReportToken(
  token: string,
): { data: AnalysisResult; expiresAt: number } | null {
  try {
    const packed = Buffer.from(token, "base64url");
    if (packed.length < 29) return null;

    const iv = packed.subarray(0, 12);
    const tag = packed.subarray(12, 28);
    const encrypted = packed.subarray(28);

    const key = getKey();
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const compressed = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);
    const json = inflateSync(compressed).toString();
    const payload = JSON.parse(json);

    if (payload.e < Date.now()) return null;
    return { data: payload.d, expiresAt: payload.e };
  } catch {
    return null;
  }
}
