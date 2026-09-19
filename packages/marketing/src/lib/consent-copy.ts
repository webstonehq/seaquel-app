/**
 * Consent wording, shared by the UI and the server.
 *
 * The checkbox label a person reads and the `consentText` written to
 * their row must be the same string — a record of consent to wording
 * that differs from what was on screen proves nothing. Client-safe (no
 * server imports) so components can render it; `$lib/server/consent`
 * re-exports it as `CONSENT_PURPOSES` for the write path.
 *
 * Changing a string here changes what future rows record. Existing rows
 * keep the wording that was shown at the time, which is the point.
 */
export const CONSENT_COPY = {
  research:
    "Email me once or twice to ask how Seaquel is working for you and what it's worth to you. No newsletter, no sales sequence. Unsubscribe in one click.",
  newsletter: "Send me new blog posts by email.",
} as const;

export type ConsentPurpose = keyof typeof CONSENT_COPY;
