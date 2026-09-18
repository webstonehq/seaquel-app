import { Allow, Entity, Fields, remult } from "remult";
import { License } from "./license";

/** Reason a license key was revoked. Informational — not enforced. */
export type RevocationReason =
  | "manual"
  | "subscription_cancelled"
  | "cycle_reduced";

/**
 * Per-license-key revocation record. Inserted from three call sites:
 *
 *   - Dashboard "revoke key" action by the owner   → reason="manual"
 *   - Dodo subscription.cancelled/failed/expired   → reason="subscription_cancelled"
 *   - Seat-count reduction at next billing cycle   → reason="cycle_reduced"
 *
 * Read by Task 3's `/api/control/airgap/bundle` endpoint to populate the
 * `revokedKeysSnapshot` in newly-issued offline bundles. The container's
 * offline dispatcher then refuses sessions for keys present in the
 * deny-list at next boot.
 *
 * The UNIQUE (subscriptionId, licenseKey) index on the table prevents
 * duplicate rows from concurrent webhook + manual insert races; callers
 * either pre-check with `findFirst` or tolerate the unique-violation
 * error as success (idempotent revocation).
 *
 * Times are unix seconds, matching `IssuedBundle.issuedAt` and the
 * bundle payload's `notAfter` claim — keep all airgap timestamps in the
 * same unit to avoid off-by-1000 bugs.
 *
 * Access control: read-only over HTTP, scoped to subscriptions owned by
 * the caller (looked up via `License.ownerUserId`). All inserts go
 * through dedicated server handlers — the webhook for automatic
 * revocations and `/api/control/airgap/revoke` for manual ones (task 3).
 */
@Entity<Revocation>("airgap_revocations", {
  allowApiRead: Allow.authenticated,
  allowApiInsert: false,
  allowApiUpdate: false,
  allowApiDelete: false,
  apiPrefilter: async () => {
    const userId = remult.user?.id;
    // Same "no-match" guard as TenantMember — an empty filter would
    // expose every row to an unauthenticated caller, the opposite of
    // what we want.
    if (!userId) return { id: "__none__" };
    const owned = await remult
      .repo(License)
      .find({ where: { ownerUserId: userId } });
    const subscriptionIds = Array.from(
      new Set(owned.map((l) => l.dodoSubscriptionId).filter((s) => s !== "")),
    );
    if (subscriptionIds.length === 0) return { id: "__none__" };
    return { subscriptionId: subscriptionIds };
  },
})
export class Revocation {
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  /** Dodo subscription id the revoked key belonged to. */
  @Fields.string({ required: true, allowApiUpdate: false })
  subscriptionId = "";

  /**
   * The Dodo license-key string being revoked. Forms a UNIQUE pair with
   * `subscriptionId` so concurrent inserters can race safely.
   */
  @Fields.string({ required: true, allowApiUpdate: false })
  licenseKey = "";

  /**
   * Better Auth user id of the operator who revoked the key. Empty
   * string for automatic revocations driven by the Dodo webhook.
   */
  @Fields.string({ allowApiUpdate: false })
  revokedByUserId = "";

  /** Unix seconds (NOT Remult's default epoch ms). */
  @Fields.integer({ allowApiUpdate: false })
  revokedAt = 0;

  @Fields.string<Revocation>({
    required: true,
    allowApiUpdate: false,
    validate: (_r, f) =>
      ["manual", "subscription_cancelled", "cycle_reduced"].includes(f.value) ||
      "invalid reason",
  })
  reason: RevocationReason = "manual";
}
