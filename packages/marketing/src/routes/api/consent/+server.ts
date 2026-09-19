/**
 * POST /api/consent — public, unauthenticated.
 *
 * Records consent to be emailed for one purpose. Replaces the old
 * `/api/newsletter/subscribe`, which stored a signup but no evidence of
 * what anyone agreed to.
 *
 * Validation and the repeat-signup decision live in `$lib/server/consent`
 * as pure functions; this handler only does IO. Notably the consent
 * wording is resolved from `purpose` server-side — a client-supplied
 * string would make the stored record useless as proof.
 *
 * Returns `{ ok: true }` for new signups AND for repeats, so the response
 * cannot be used to probe which addresses are already subscribed.
 * `400` on shape errors, `429` with `Retry-After` on rate limit.
 */
import { json, type RequestHandler } from "@sveltejs/kit";
import { remult } from "remult";
import { EmailConsent } from "$lib/entities/email-consent";
import { createUnsubscribeToken, parseConsentRequest, planConsentWrite } from "$lib/server/consent";
import { enforceRateLimit } from "$lib/server/rate-limit";

export const POST: RequestHandler = async (event) => {
  await enforceRateLimit(event, { bucket: "consent", windowSeconds: 60, max: 3 });

  let body: unknown;
  try {
    body = await event.request.json();
  } catch {
    return json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const parsed = parseConsentRequest(body);
  if (!parsed.ok) return json({ ok: false, error: parsed.error }, { status: 400 });
  const { email, purpose, source, consentText } = parsed.value;

  // Proof-of-consent fields come from the request envelope, never the
  // body, so a caller cannot forge them.
  const consentIp = event.request.headers.get("CF-Connecting-IP") ?? event.getClientAddress();
  const consentUserAgent = (event.request.headers.get("User-Agent") ?? "").slice(0, 256);

  try {
    const repo = remult.repo(EmailConsent);
    const existing = await repo.findFirst({ email, purpose });
    const plan = planConsentWrite(existing ?? null);

    if (plan.action === "insert") {
      await repo.insert({
        email,
        purpose,
        source,
        consentText,
        status: "active",
        consentedAt: new Date(),
        consentIp,
        consentUserAgent,
        unsubscribeToken: createUnsubscribeToken(),
      });
    } else if (plan.action === "reactivate") {
      await repo.update(existing!.id, {
        status: "active",
        source,
        consentText,
        consentedAt: new Date(),
        consentIp,
        consentUserAgent,
        unsubscribedAt: undefined,
      });
    }
    // plan.action === "none": already active. The original consent
    // record is the one worth keeping, so it is left untouched.
  } catch (err) {
    // A race between findFirst and insert can still collide on the
    // unique index. Reporting the error would leak subscription state,
    // so it is logged and reported as success.
    console.debug("[consent] write failed; reporting success", err);
  }

  return json({ ok: true });
};
