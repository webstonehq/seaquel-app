/**
 * Consent capture for marketing email.
 *
 * All the decision-making lives here as pure functions so it can be
 * tested without a D1 binding — the route handlers stay thin shells that
 * do IO and delegate.
 *
 * The wording a person agreed to is stored per row, and it is resolved
 * *here* from `purpose` rather than accepted from the request body. A
 * client-supplied consent string would let anyone write arbitrary text
 * into a consent record, which makes the record worthless as proof.
 */
import { CONSENT_COPY, type ConsentPurpose } from "$lib/consent-copy";

/**
 * Consent wording, verbatim as shown in the UI. Defined in
 * `$lib/consent-copy` so the checkbox label and the stored text cannot
 * drift apart.
 */
export const CONSENT_PURPOSES = CONSENT_COPY;

export type { ConsentPurpose };

export type ConsentError =
  | "invalid_email"
  | "invalid_purpose"
  | "invalid_source"
  | "consent_required";

export interface ConsentInput {
  email: string;
  purpose: ConsentPurpose;
  source: string;
  consentText: string;
}

export type ParseResult =
  | { ok: true; value: ConsentInput }
  | { ok: false; error: ConsentError };

// RFC-5322-lite. Keeps obvious junk out; nothing downstream depends on
// it being exhaustive.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isPurpose = (value: unknown): value is ConsentPurpose =>
  typeof value === "string" && Object.hasOwn(CONSENT_PURPOSES, value);

/** Validate and normalise a signup request body. */
export function parseConsentRequest(body: unknown): ParseResult {
  const raw = (body ?? {}) as Record<string, unknown>;

  const email = typeof raw.email === "string" ? raw.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, error: "invalid_email" };
  }

  if (!isPurpose(raw.purpose)) return { ok: false, error: "invalid_purpose" };

  const source = typeof raw.source === "string" ? raw.source.trim() : "";
  if (!source || source.length > 64) return { ok: false, error: "invalid_source" };

  // Strictly `true`. A truthy "on" from a stray form post is not an
  // affirmative act we want to record as consent.
  if (raw.consent !== true) return { ok: false, error: "consent_required" };

  return {
    ok: true,
    value: { email, purpose: raw.purpose, source, consentText: CONSENT_PURPOSES[raw.purpose] },
  };
}

export type ConsentWritePlan =
  | { action: "insert" }
  | { action: "reactivate" }
  | { action: "none" };

/**
 * Decide what a repeat signup should do.
 *
 * An active row is left alone: the *first* consent is the one worth
 * proving, so re-submitting must not overwrite its timestamp. An
 * unsubscribed row is reactivated with fresh proof — otherwise anyone
 * who ever unsubscribed could never opt back in.
 */
export function planConsentWrite(existing: { status: string } | null): ConsentWritePlan {
  if (!existing) return { action: "insert" };
  return existing.status === "unsubscribed" ? { action: "reactivate" } : { action: "none" };
}

/** `someone@example.com` -> `s••••••@example.com`, for the unsubscribe page. */
export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at <= 0) return email;
  const local = email.slice(0, at);
  return `${local[0]}${"•".repeat(local.length - 1)}${email.slice(at)}`;
}

/** 32 random bytes, base64url — 43 chars, no padding. */
export function createUnsubscribeToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
