import { Entity, Fields, Validators } from "remult";

/**
 * A marketing-site newsletter signup. All CRUD over the generic Remult
 * REST endpoint is denied — public signup goes through
 * `/api/newsletter/subscribe` instead, which can apply rate limiting and
 * email validation before reaching the table. Admin tooling that needs
 * to enumerate subscribers should go through the D1 console or a
 * server-side handler.
 *
 * `email` is UNIQUE. The signup endpoint swallows duplicate-insert
 * errors and always shows a success state, so resubscribing looks the
 * same as a first-time signup.
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
