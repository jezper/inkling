/**
 * Rate limiter med Vercel KV som primär store och in-memory fallback.
 * KV ger persistent, cross-instance rate limiting på Vercel.
 * In-memory används vid lokal utveckling eller KV-avbrott.
 */

import { kv } from "@vercel/kv";

// In-memory fallback
const memStore = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOpts {
  maxRequests: number;
  windowSeconds: number;
}

const TIERS: Record<string, RateLimitOpts> = {
  analyze: { maxRequests: 5, windowSeconds: 3600 },
  general: { maxRequests: 10, windowSeconds: 3600 },
  refund: { maxRequests: 5, windowSeconds: 3600 },
};

export async function checkRateLimit(
  ip: string,
  tier: string = "analyze",
): Promise<{ allowed: boolean; remaining: number }> {
  const opts = TIERS[tier] ?? TIERS.analyze;

  // Try KV first
  try {
    const key = `rl:${tier}:${ip}`;
    const count = await kv.incr(key);
    if (count === 1) {
      await kv.expire(key, opts.windowSeconds);
    }
    const allowed = count <= opts.maxRequests;
    return { allowed, remaining: Math.max(0, opts.maxRequests - count) };
  } catch {
    // KV unavailable — fall back to in-memory
    return checkMemoryLimit(ip, tier, opts);
  }
}

function checkMemoryLimit(
  ip: string,
  tier: string,
  opts: RateLimitOpts,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = `${tier}:${ip}`;
  const entry = memStore.get(key);

  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + opts.windowSeconds * 1000 });
    return { allowed: true, remaining: opts.maxRequests - 1 };
  }

  if (entry.count >= opts.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: opts.maxRequests - entry.count };
}
