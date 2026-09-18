import { Entity, Fields, Validators } from "remult";

/**
 * Dodo Payments webhook idempotency store. Every event delivered to
 * `/api/control/dodo/webhook` checks here first; if the event id exists,
 * the handler returns 200 without doing anything else.
 *
 * Dodo retries webhooks aggressively on 5xx, and even a single 2xx can be
 * followed by duplicates after network hiccups. Without this table,
 * retries would create duplicate tenants or double-apply subscription
 * changes.
 *
 * `dodoEventId` is the unique-by-Dodo id on the webhook payload; we rely
 * on SQLite's UNIQUE constraint to make insert-or-fail atomic.
 */
@Entity<AppliedEvent>("applied_events", {
  // Server-only — written and read exclusively by the webhook handler.
  allowApiCrud: false,
})
export class AppliedEvent {
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  @Fields.string({
    required: true,
    validate: Validators.unique(),
    allowApiUpdate: false,
  })
  dodoEventId = "";

  /**
   * Dodo event type (e.g. `subscription.active`, `payment.succeeded`).
   * Stored alongside the id so ops can eyeball the table and see event
   * distribution without parsing detail JSON.
   */
  @Fields.string({ required: true, allowApiUpdate: false })
  eventType = "";

  @Fields.createdAt({ allowApiUpdate: false })
  appliedAt!: Date;
}
