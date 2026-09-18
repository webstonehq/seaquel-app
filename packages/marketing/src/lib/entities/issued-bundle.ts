import { Entity, Fields } from "remult";

/**
 * Audit record for an offline (air-gapped) bundle that the control plane
 * issued to a customer's owner via /dashboard/[slug]/airgap.
 *
 * Each row captures the exact payload that was signed and downloaded:
 *
 *   - `seatTokensSnapshot` — the array of per-seat license-key descriptors
 *     embedded in the bundle (used by the container's offline dispatcher
 *     to enumerate which keys are entitled this cycle).
 *   - `revokedKeysSnapshot` — the deny-list embedded in the bundle so the
 *     container can deactivate previously-issued keys that the owner has
 *     since revoked.
 *   - `payloadSha256` — SHA-256 of the canonical JSON payload; surfaced
 *     to ops for forensics ("did we hand this bytes-for-bytes?").
 *   - `pubkeyFingerprint` — fingerprint of the Ed25519 signing key, so
 *     post-key-rotation we can tell which key signed each historical
 *     bundle.
 *
 * `notAfter` is the bundle expiry (epoch seconds) baked into the signed
 * payload. Task 3's endpoints refuse to issue a bundle whose `notAfter`
 * regresses against the most recent row for the same subscription
 * (monotonic-expiry guard).
 *
 * Times in this table are unix seconds (not Remult's default epoch ms)
 * because bundle payloads, the container's verifier, and the signed
 * `notAfter` claim all speak seconds — keeping the audit row in the same
 * unit avoids off-by-1000 bugs in ops queries.
 *
 * Server-only: `allowApiCrud: false`. Reads and writes go through the
 * dedicated `/api/control/airgap/*` handlers, which enforce ownership.
 */
@Entity<IssuedBundle>("issued_bundles", {
  allowApiCrud: false,
})
export class IssuedBundle {
  @Fields.id({ allowApiUpdate: false })
  id!: string;

  /** Dodo subscription id this bundle was issued against. */
  @Fields.string({ required: true, allowApiUpdate: false })
  subscriptionId = "";

  /**
   * The anchor License row for the tenant. Joiner-license rows in the
   * same subscription are represented inside `seatTokensSnapshot`, not
   * here.
   */
  @Fields.string({ required: true, allowApiUpdate: false })
  licenseId = "";

  /** Tenant the bundle was generated for. */
  @Fields.string({ required: true, allowApiUpdate: false })
  tenantId = "";

  /**
   * Better Auth user id that triggered the bundle issuance. Always the
   * tenant owner — the airgap UI is owner-only.
   */
  @Fields.string({ required: true, allowApiUpdate: false })
  issuedByUserId = "";

  /** Unix seconds; null only briefly before the insert callback fires. */
  @Fields.integer({ allowApiUpdate: false })
  issuedAt = 0;

  /**
   * Bundle expiry in unix seconds. Task 3 endpoints enforce that
   * subsequent bundles for the same subscription must not regress
   * `notAfter`, so a stolen older bundle can't out-live a newer one.
   */
  @Fields.integer({ required: true, allowApiUpdate: false })
  notAfter = 0;

  /**
   * Snapshot of the seat-token descriptors embedded in the signed
   * payload. Shape is defined by the bundle schema in task 1's crypto
   * module; stored as opaque JSON here.
   */
  @Fields.json()
  seatTokensSnapshot: unknown[] = [];

  /**
   * Snapshot of the revocation deny-list embedded in the signed payload
   * at issue time. A copy (not a reference) so post-hoc revocations
   * don't mutate history.
   */
  @Fields.json()
  revokedKeysSnapshot: unknown[] = [];

  /** Lowercase hex SHA-256 of the canonical signed payload. */
  @Fields.string({ required: true, allowApiUpdate: false })
  payloadSha256 = "";

  /** Fingerprint of the Ed25519 pubkey used to sign this bundle. */
  @Fields.string({ required: true, allowApiUpdate: false })
  pubkeyFingerprint = "";
}
