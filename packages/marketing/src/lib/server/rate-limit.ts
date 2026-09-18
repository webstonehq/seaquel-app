/**
 * Per-IP rate limit backed by Cloudflare KV.
 *
 * Workers isolates don't share memory across requests, so a process-local
 * Map (the pattern the desktop container uses) can't track hits. KV is
 * the cheapest store that survives across invocations; D1 would work too
 * but each rate-limit check would burn an SQL round-trip per request.
 *
 * Consistency caveat: KV is eventually consistent. Two parallel reads
 * from the same IP can each see "0/5" and both write "1/5", so the count
 * may briefly under-count. That's acceptable — this is abuse mitigation,
 * not an exact quota. For paths that need an exact quota, use a Durable
 * Object instead.
 *
 * Cost: each guarded request does one KV get + one KV put. At Workers'
 * 100k free reads/day / 1k free writes/day a marketing site easily
 * fits. If a route becomes hot enough to matter, swap to a Cloudflare
 * Rate Limiting (WAF) rule applied at the edge — same effect, no app
 * code involved.
 */

import { error, type RequestEvent } from "@sveltejs/kit";
import type { KVNamespace } from "@cloudflare/workers-types";

export interface RateLimitOptions {
  /** Logical bucket name. Mixed with the IP to form the KV key. */
  bucket: string;
  /** Time window in seconds. Becomes the KV `expirationTtl`. */
  windowSeconds: number;
  /** Max hits per IP within the window. */
  max: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds the caller should wait before retrying. 0 when `ok = true`. */
  retryAfter: number;
}

/**
 * Apply a per-IP rate limit to the request. If KV isn't bound (local
 * `vite dev` without wrangler), the limiter degrades to a no-op so the
 * dev loop isn't broken — production always has KV.
 */
export async function checkRateLimit(
  event: RequestEvent,
  opts: RateLimitOptions,
): Promise<RateLimitResult> {
  const kv = (event.platform?.env as { GITHUB_API_CACHE?: KVNamespace } | undefined)
    ?.GITHUB_API_CACHE;
  if (!kv) return { ok: true, retryAfter: 0 };

  const ip = event.getClientAddress();
  if (!ip) return { ok: true, retryAfter: 0 };

  const key = `rl:${opts.bucket}:${ip}`;
  const raw = await kv.get(key);
  const count = raw ? Number.parseInt(raw, 10) : 0;
  if (Number.isFinite(count) && count >= opts.max) {
    return { ok: false, retryAfter: opts.windowSeconds };
  }
  // expirationTtl resets the window-end on every increment within the
  // window. That's a sliding-ish window — slightly more permissive than
  // a strict fixed window, but fine at these thresholds.
  await kv.put(key, String(count + 1), { expirationTtl: opts.windowSeconds });
  return { ok: true, retryAfter: 0 };
}

/**
 * Convenience: enforce a rate limit, throw SvelteKit's 429 if exceeded.
 * Use this when the handler should bail before its main work.
 */
export async function enforceRateLimit(
  event: RequestEvent,
  opts: RateLimitOptions,
): Promise<void> {
  const result = await checkRateLimit(event, opts);
  if (!result.ok) {
    event.setHeaders({ "Retry-After": String(result.retryAfter) });
    throw error(429, "too many requests");
  }
}
