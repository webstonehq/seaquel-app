import { Allow, Entity, Fields, remult } from "remult";

/**
 * A purchased Seaquel license. Each row represents one Dodo subscription
 * and entitles the owner to:
 *
 *   - `seats` desktop activations (Dodo-tracked, not stored here)
 *   - access to **at most one** Cloud tenant — see `Tenant.licenseId`
 *
 * One Better Auth user can own many licenses (= many tenants); each
 * license has its own billing cycle.
 *
 * Populated either by:
 *
 *   - **Dodo webhooks** (`subscription.active` + `license_key.created`,
 *     order not guaranteed) — handler upserts by `dodoSubscriptionId` and
 *     fills whichever fields the current event carries.
 *   - **Manual key entry** at `/dashboard/activate` — user pastes the key,
 *     we validate via Dodo and write the row with `ownerUserId` set
 *     immediately (the user is already signed in).
 *
 * `ownerUserId` stays `""` until a Better Auth user with the same,
 * verified email signs in (`linkByVerifiedEmail` in
 * `server/remult/auth-helpers.ts` claims unlinked rows by email match).
 *
 * `planId` is the **Dodo product ID** (e.g. `pdt_0NYVr6Fe7j3GenJdKuTwb`),
 * not a human-readable tier — resolve via `PLAN_META` + the product map.
 */
@Entity<License>("licenses", {
  // Read-only over HTTP, scoped to the caller's own licenses. All writes
  // go through server-side handlers (webhook, /api/control/licenses/activate),
  // which use the data provider directly and aren't subject to these
  // flags. `apiPrefilter` does NOT apply to inserts, so allowing API
  // writes here would let any user mint an active license for themselves.
  allowApiRead: Allow.authenticated,
  allowApiInsert: false,
  allowApiUpdate: false,
  allowApiDelete: false,
  apiPrefilter: () => ({ ownerUserId: remult.user?.id ?? "" }),
})
export class License {
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  /** Email the buyer used at Dodo checkout. Used for auto-linking. */
  @Fields.string({ required: true })
  email = "";

  /** Dodo product ID this license was purchased for. */
  @Fields.string({ required: true })
  planId = "";

  /**
   * Dodo license key. Unique per purchase — if the same user buys twice,
   * they get two keys and two License rows.
   *
   * Initially `""` because `subscription.active` (which doesn't carry the
   * key) may arrive before `license_key.created`. The webhook handler
   * upserts and the key is filled in once `license_key.created` lands.
   */
  @Fields.string({ required: false })
  licenseKey = "";

  /**
   * Number of seats the buyer purchased. 1 for individual, n for
   * business — mirrors Dodo's `subscription.quantity`. Caps how many
   * `TenantMember` rows can exist on the linked tenant.
   */
  @Fields.integer({ required: true })
  seats = 1;

  @Fields.string({ required: false })
  dodoCustomerId = "";

  /**
   * Dodo subscription id. The webhook handler upserts License rows by
   * this column, so it's effectively the row's natural key. Indexed in
   * the migration for the cancel/expire lookup path.
   */
  @Fields.string({ required: false })
  dodoSubscriptionId = "";

  /**
   * Mirrors Dodo's subscription status. We trust this column as the
   * source of truth and only update it from webhook events.
   */
  @Fields.string({
    required: true,
    validate: (_r, f) =>
      ["active", "past_due", "canceled", "expired"].includes(f.value) ||
      "invalid status",
  })
  status = "active";

  /**
   * When the license last left `active` (set by the cancel/fail/expire
   * webhook). Anchors the air-gap grace window so it can't be extended
   * by re-downloading bundles. Stale once the license is re-activated —
   * only meaningful while `status !== "active"`.
   */
  @Fields.date({ required: false })
  canceledAt?: Date;

  /** End of the current Dodo billing cycle. Set by `subscription.active`. */
  @Fields.date({ required: false })
  currentPeriodEnd?: Date;

  /**
   * Better Auth user id who owns this license. `""` until the buyer
   * signs up (auto-linked by email) or pastes the key at /dashboard/activate.
   */
  @Fields.string({ required: false })
  ownerUserId = "";

  @Fields.createdAt({ allowApiUpdate: false })
  createdAt!: Date;

  @Fields.updatedAt()
  updatedAt!: Date;
}
