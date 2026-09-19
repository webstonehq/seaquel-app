import { Entity, Fields, Validators } from "remult";
// `$lib/consent-copy`, not `$lib/server/consent`: entities are bundled
// for the browser via `src/hooks.ts`, so they must not import server code.
import { CONSENT_COPY } from "$lib/consent-copy";

/**
 * A record of someone consenting to be emailed for one purpose.
 *
 * All CRUD over the generic Remult REST endpoint is denied. Public
 * signup goes through `/api/consent`, which rate-limits and captures
 * proof-of-consent fields the client must not be able to set; the
 * unsubscribe page reads and writes rows server-side by token.
 *
 * Unique on (email, purpose), so the same address can hold independent
 * consent for research contact and for the newsletter.
 */
@Entity<EmailConsent>("email_consents", {
  // Remult's `allowApiRead` defaults to true, so the entity is closed
  // wholesale — leaving read open would publish the subscriber list.
  allowApiCrud: false,
})
export class EmailConsent {
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  @Fields.string({ required: true, validate: [Validators.email()] })
  email = "";

  /** Which consent this row records. See `CONSENT_COPY`. */
  @Fields.string({
    required: true,
    validate: (_r, f) =>
      Object.hasOwn(CONSENT_COPY, f.value) || "invalid purpose",
  })
  purpose = "";

  @Fields.string({
    required: true,
    validate: (_r, f) =>
      ["active", "unsubscribed"].includes(f.value) || "invalid status",
  })
  status = "active";

  /** Where the signup came from, e.g. `"download:macos"`, `"blog-post:<slug>"`. */
  @Fields.string({ required: true })
  source = "";

  /** Verbatim wording the person agreed to, resolved server-side. */
  @Fields.string({ required: true })
  consentText = "";

  @Fields.date()
  consentedAt?: Date;

  /** From `CF-Connecting-IP`. Part of the consent record; disclosed on /privacy. */
  @Fields.string()
  consentIp = "";

  @Fields.string()
  consentUserAgent = "";

  /** Unguessable per-row token; the only way to reach the unsubscribe page. */
  @Fields.string({ allowApiUpdate: false })
  unsubscribeToken = "";

  @Fields.date()
  unsubscribedAt?: Date;
}
