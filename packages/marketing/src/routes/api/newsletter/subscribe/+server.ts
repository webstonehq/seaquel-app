/**
 * POST /api/newsletter/subscribe — public, unauthenticated.
 *
 * Replaces the previous generic Remult `allowApiInsert` endpoint for
 * `newsletter_subscribers` so we can:
 *
 *   1. Rate-limit per IP (KV-backed) — abuse mitigation against scripted
 *      flooding with incremented email addresses; uniqueness alone would
 *      otherwise let an attacker append unbounded junk rows.
 *   2. Sanity-check the payload (email shape, source non-empty) before
 *      it hits Remult validators.
 *   3. Swallow duplicate-email errors silently so resubscribing produces
 *      the same success UX as a first-time signup.
 *
 * Returns `{ ok: true }` on success and on idempotent duplicate inserts;
 * `429` with `Retry-After` on rate limit; `400` on shape errors.
 */
import { json, type RequestHandler } from "@sveltejs/kit";
import { remult } from "remult";
import { NewsletterSubscriber } from "$lib/entities/newsletter-subscriber";
import { enforceRateLimit } from "$lib/server/rate-limit";

interface SubscribeBody {
  email?: string;
  source?: string;
}

// RFC-5322-lite. Good enough to keep obvious junk out; the Remult
// validator does the strict pass.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: RequestHandler = async (event) => {
  await enforceRateLimit(event, {
    bucket: "newsletter",
    windowSeconds: 60,
    max: 3,
  });

  let body: SubscribeBody;
  try {
    body = (await event.request.json()) as SubscribeBody;
  } catch {
    return json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const source = body.source?.trim() ?? "";
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (!source || source.length > 64) {
    return json({ ok: false, error: "invalid_source" }, { status: 400 });
  }

  try {
    await remult.repo(NewsletterSubscriber).insert({ email, source });
  } catch (err) {
    // Duplicate-email collisions and transient errors are swallowed —
    // exposing them would let an enumeration attacker probe which
    // addresses are subscribed. Logged for visibility.
    console.debug("[newsletter] insert failed; reporting success", err);
  }
  return json({ ok: true });
};
