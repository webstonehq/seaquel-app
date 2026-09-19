import { describe, expect, it } from "vitest";
import {
  CONSENT_PURPOSES,
  createUnsubscribeToken,
  maskEmail,
  parseConsentRequest,
  planConsentWrite,
} from "./consent";

const valid = {
  email: "someone@example.com",
  purpose: "research",
  source: "download:macos",
  consent: true,
};

describe("parseConsentRequest", () => {
  it("accepts a well-formed research signup", () => {
    const result = parseConsentRequest(valid);
    expect(result).toEqual({
      ok: true,
      value: {
        email: "someone@example.com",
        purpose: "research",
        source: "download:macos",
        consentText: CONSENT_PURPOSES.research,
      },
    });
  });

  it("normalises the email to trimmed lowercase", () => {
    const result = parseConsentRequest({ ...valid, email: "  Someone@Example.COM " });
    expect(result.ok && result.value.email).toBe("someone@example.com");
  });

  it("rejects a missing consent flag", () => {
    expect(parseConsentRequest({ ...valid, consent: undefined })).toEqual({
      ok: false,
      error: "consent_required",
    });
  });

  it("rejects an explicit consent: false", () => {
    expect(parseConsentRequest({ ...valid, consent: false })).toEqual({
      ok: false,
      error: "consent_required",
    });
  });

  it("rejects a consent value that is merely truthy", () => {
    expect(parseConsentRequest({ ...valid, consent: "on" })).toEqual({
      ok: false,
      error: "consent_required",
    });
  });

  it("rejects an unknown purpose", () => {
    expect(parseConsentRequest({ ...valid, purpose: "spam" })).toEqual({
      ok: false,
      error: "invalid_purpose",
    });
  });

  it("ignores client-supplied consent text and uses the server's wording", () => {
    const result = parseConsentRequest({
      ...valid,
      consentText: "I agree to absolutely anything forever",
    });
    expect(result.ok && result.value.consentText).toBe(CONSENT_PURPOSES.research);
  });

  it.each([["no-at-sign"], ["two@@at.com"], ["trailing@dot"], [""], ["sp ace@example.com"]])(
    "rejects malformed email %j",
    (email) => {
      expect(parseConsentRequest({ ...valid, email })).toEqual({
        ok: false,
        error: "invalid_email",
      });
    },
  );

  it("rejects an over-long email", () => {
    const email = `${"a".repeat(250)}@example.com`;
    expect(parseConsentRequest({ ...valid, email })).toEqual({
      ok: false,
      error: "invalid_email",
    });
  });

  it("rejects a missing or over-long source", () => {
    expect(parseConsentRequest({ ...valid, source: "" })).toEqual({
      ok: false,
      error: "invalid_source",
    });
    expect(parseConsentRequest({ ...valid, source: "x".repeat(65) })).toEqual({
      ok: false,
      error: "invalid_source",
    });
  });

  it("rejects a non-object body", () => {
    expect(parseConsentRequest(null)).toEqual({ ok: false, error: "invalid_email" });
  });
});

describe("planConsentWrite", () => {
  it("inserts when no row exists for this email and purpose", () => {
    expect(planConsentWrite(null)).toEqual({ action: "insert" });
  });

  it("reactivates a previously unsubscribed row", () => {
    expect(planConsentWrite({ status: "unsubscribed" })).toEqual({ action: "reactivate" });
  });

  it("leaves an already-active row untouched so the first consent is preserved", () => {
    expect(planConsentWrite({ status: "active" })).toEqual({ action: "none" });
  });
});

describe("maskEmail", () => {
  it("keeps the first character and the domain", () => {
    expect(maskEmail("someone@example.com")).toBe(`s${"•".repeat(6)}@example.com`);
  });

  it("does not crash on a single-character local part", () => {
    expect(maskEmail("a@example.com")).toBe("a@example.com");
  });
});

describe("createUnsubscribeToken", () => {
  it("is url-safe and long enough to be unguessable", () => {
    const token = createUnsubscribeToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("does not repeat", () => {
    const tokens = new Set(Array.from({ length: 100 }, createUnsubscribeToken));
    expect(tokens.size).toBe(100);
  });
});
