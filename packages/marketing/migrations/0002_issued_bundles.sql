-- Air-gapped Seaquel control plane: issued offline bundles + per-key
-- revocation list. Both tables back the `/api/control/airgap/*` endpoints
-- (see task 3) and are read by the dispatcher in the seaquel container
-- when it boots with an offline bundle present.
--
-- Apply locally:    wrangler d1 migrations apply SEAQUEL_DB --local
-- Apply to prod:    wrangler d1 migrations apply SEAQUEL_DB --remote
--
-- Column shapes follow the same Remult/SQLite conventions as 0001_init.sql:
-- strings default to '', JSON columns default to '0' (Remult quirk),
-- timestamps are stored as epoch INTEGER. Keep these in sync with the
-- entity classes in `src/lib/entities/issued-bundle.ts` and
-- `src/lib/entities/revocation.ts`.

-- Audit + replay record for every offline bundle the owner downloads from
-- /dashboard/[slug]/airgap. Carries the same `seatTokensSnapshot` and
-- `revokedKeysSnapshot` JSON blobs that were embedded in the signed
-- bundle, plus the SHA-256 of the canonical payload and the fingerprint
-- of the Ed25519 pubkey that signed it. Used by ops to answer "what did
-- we hand this customer, when?" and by task 3 endpoints to refuse
-- monotonic rollbacks.
CREATE TABLE IF NOT EXISTS `issued_bundles` (
  `id`                  TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `subscriptionId`      TEXT    DEFAULT '' NOT NULL,
  `licenseId`           TEXT    DEFAULT '' NOT NULL,
  `tenantId`            TEXT    DEFAULT '' NOT NULL,
  `issuedByUserId`      TEXT    DEFAULT '' NOT NULL,
  `issuedAt`            INTEGER,
  `notAfter`            INTEGER DEFAULT 0  NOT NULL,
  `seatTokensSnapshot`  JSON    DEFAULT '0' NOT NULL,
  `revokedKeysSnapshot` JSON    DEFAULT '0' NOT NULL,
  `payloadSha256`       TEXT    DEFAULT '' NOT NULL,
  `pubkeyFingerprint`   TEXT    DEFAULT '' NOT NULL
);
CREATE INDEX IF NOT EXISTS `issued_bundles_sub_idx` ON `issued_bundles` (`subscriptionId`, `issuedAt`);

-- Per-license-key revocation list. Inserted either by the owner from the
-- dashboard (reason='manual'), by the Dodo webhook when a subscription
-- ends (reason='subscription_cancelled'), or by the seat-count downgrade
-- path (reason='cycle_reduced'). Bundles handed out after a row appears
-- here will exclude/embed the key in `revokedKeysSnapshot`, and the
-- container's dispatcher walks the row to deactivate the matching
-- license on next boot. The UNIQUE (subscriptionId, licenseKey) guard
-- keeps double-inserts harmless — the webhook treats unique-violation as
-- success.
CREATE TABLE IF NOT EXISTS `airgap_revocations` (
  `id`              TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `subscriptionId`  TEXT    DEFAULT '' NOT NULL,
  `licenseKey`      TEXT    DEFAULT '' NOT NULL,
  `revokedByUserId` TEXT    DEFAULT '' NOT NULL,
  `revokedAt`       INTEGER,
  `reason`          TEXT    DEFAULT 'manual' NOT NULL  -- 'manual' | 'subscription_cancelled' | 'cycle_reduced'
);
CREATE UNIQUE INDEX IF NOT EXISTS `airgap_revocations_sub_key_unique`
  ON `airgap_revocations` (`subscriptionId`, `licenseKey`);
