import { Entity, Fields, Validators } from "remult";

/**
 * DEPRECATED — superseded by `EmailConsent` (`email_consents`).
 *
 * Migration 0005 copied these rows across as `purpose='newsletter'`.
 * Nothing reads or writes this table any more; it is kept only so the
 * backfill can be re-checked, and is dropped in a later migration.
 *
 * It recorded that someone signed up but never what they agreed to, and
 * nothing could set `status` to 'unsubscribed' — which is why it was
 * replaced.
 */
@Entity<NewsletterSubscriber>("newsletter_subscribers", {
  // Fully closed: Remult's `allowApiRead` defaults to `true`, so only
  // disabling insert would leave the whole list publicly readable.
  allowApiCrud: false,
})
export class NewsletterSubscriber {
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  @Fields.string({
    required: true,
    validate: [Validators.email(), Validators.unique()],
  })
  email = "";

  /** Where the signup came from, e.g. `"blog-index"` or `"blog-post:<slug>"`. */
  @Fields.string({ required: true })
  source = "";

  @Fields.string({
    required: true,
    validate: (_r, f) =>
      ["active", "unsubscribed"].includes(f.value) || "invalid status",
  })
  status = "active";

  @Fields.createdAt({ allowApiUpdate: false })
  createdAt!: Date;
}
