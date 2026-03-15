/**
 * Enkel in-memory rate limiter per IP.
 * Fungerar per serverless-instans — inte perfekt men tillräckligt för V1.
 * Vid hög volym: byt till Vercel KV eller Upstash Redis.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000; // 1 timme
const MAX_REQUESTS = 5; // max 5 analyser per IP per timme

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

// Städa gamla entries var 10:e minut
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store) {
    if (now > entry.resetAt) store.delete(ip);
  }
}, 10 * 60 * 1000);
