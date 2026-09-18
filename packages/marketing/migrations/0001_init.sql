-- Consolidated initial schema for Seaquel Cloud's control plane.
--
-- These tables sit next to Better Auth's user/session/account/verification
-- tables in the same D1 database (`SEAQUEL_DB`). Remult auto-creates them
-- in dev against better-sqlite3 via `ensureSchema` — this file is for
-- production D1 where auto-creation isn't available (the D1 binding is
-- per-request, so the one-time bootstrap `ensureSchema` pass doesn't run).
--
-- Apply locally:    wrangler d1 migrations apply SEAQUEL_DB --local
-- Apply to prod:    wrangler d1 migrations apply SEAQUEL_DB --remote
--
-- Column shapes match Remult's SQLite core conventions exactly (e.g.
-- strings default to '', booleans are INTEGER 0/1, dates are epoch ms
-- stored as INTEGER, JSON columns default to '0' — that's a Remult quirk,
-- not a typo). Keep these in sync with the entity classes in
-- `src/lib/entities/*.ts`.

-- Purchased licenses from Dodo Payments. One row per subscription; each
-- entitles the owner to seats and at most one Cloud tenant.
CREATE TABLE IF NOT EXISTS `licenses` (
  `id`                    TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `email`                 TEXT    DEFAULT '' NOT NULL,
  `planId`                TEXT    DEFAULT '' NOT NULL,
  `licenseKey`            TEXT    DEFAULT '' NOT NULL,
  `seats`                 INTEGER DEFAULT 1  NOT NULL,
  `dodoCustomerId`        TEXT    DEFAULT '' NOT NULL,
  `dodoSubscriptionId`    TEXT    DEFAULT '' NOT NULL,
  `status`                TEXT    DEFAULT 'active' NOT NULL,
  `currentPeriodEnd`      INTEGER,
  `ownerUserId`           TEXT    DEFAULT '' NOT NULL,
  `createdAt`             INTEGER,
  `updatedAt`             INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS `licenses_key_unique`    ON `licenses` (`licenseKey`);
CREATE INDEX        IF NOT EXISTS `licenses_email_idx`     ON `licenses` (`email`);
CREATE INDEX        IF NOT EXISTS `licenses_owner_idx`     ON `licenses` (`ownerUserId`);
-- Webhook `subscription.cancelled|failed|expired` events look up licenses
-- by Dodo subscription id to flip status.
CREATE INDEX        IF NOT EXISTS `licenses_dodo_sub_idx`  ON `licenses` (`dodoSubscriptionId`);

-- Provisioned Seaquel Cloud instances (and synthetic rows for self-hosted
-- installs, with platform/machineId/publicUrl empty). `licenseId` UNIQUE
-- enforces 1:1 with a License.
CREATE TABLE IF NOT EXISTS `tenants` (
  `id`           TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `slug`         TEXT    DEFAULT '' NOT NULL,
  `licenseId`    TEXT    DEFAULT '' NOT NULL,
  `ownerUserId`  TEXT    DEFAULT '' NOT NULL,
  `platform`     TEXT    DEFAULT '' NOT NULL,
  `region`       TEXT    DEFAULT '' NOT NULL,
  `machineId`    TEXT    DEFAULT '' NOT NULL,
  `publicUrl`    TEXT    DEFAULT '' NOT NULL,
  `status`       TEXT    DEFAULT 'provisioning' NOT NULL,
  `createdAt`    INTEGER,
  `suspendedAt`  INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS `tenants_slug_unique`    ON `tenants` (`slug`);
CREATE UNIQUE INDEX IF NOT EXISTS `tenants_license_unique` ON `tenants` (`licenseId`);
CREATE INDEX        IF NOT EXISTS `tenants_owner_idx`      ON `tenants` (`ownerUserId`);

-- Seat occupancy for a tenant — owner row auto-inserted on provision,
-- extra rows created by invite on Business plans, additional rows filled
-- by `/api/cloud/bind-member` when a teammate's container signs them up.
CREATE TABLE IF NOT EXISTS `tenant_members` (
  `id`              TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `tenantId`        TEXT    DEFAULT '' NOT NULL,
  `userId`          TEXT    DEFAULT '' NOT NULL,
  `email`           TEXT    DEFAULT '' NOT NULL,
  `role`            TEXT    DEFAULT 'member' NOT NULL,
  `status`          TEXT    DEFAULT 'pending' NOT NULL,
  `invitedAt`       INTEGER,
  `acceptedAt`      INTEGER,
  `licenseKey`      TEXT    DEFAULT '' NOT NULL,
  `containerUserId` TEXT    DEFAULT '' NOT NULL,
  `boundAt`         INTEGER
);
CREATE INDEX IF NOT EXISTS `tenant_members_tenant_idx`  ON `tenant_members` (`tenantId`);
CREATE INDEX IF NOT EXISTS `tenant_members_user_idx`    ON `tenant_members` (`userId`);
CREATE INDEX IF NOT EXISTS `tenant_members_email_idx`   ON `tenant_members` (`email`);
-- Subscription-cancel webhooks find affected memberships by licenseKey;
-- /api/cloud/verify-membership-license uses this index to detect a key
-- already bound to a different tenant.
CREATE INDEX IF NOT EXISTS `tenant_members_license_idx` ON `tenant_members` (`licenseKey`);

-- Per-installation records for the unified Cloud + self-hosted control
-- plane. One row per running Seaquel install. The `X-Install-Id` +
-- `X-License-Key` header pair on `/api/cloud/*` calls lets the control
-- plane verify that the presented license belongs to the same Dodo
-- subscription that originally registered the install.
--
--   - Cloud tenants: install row created at provision time, `tenantId ==
--     Tenant.id`, `subscriptionId == License.dodoSubscriptionId` of the
--     anchor license.
--   - Self-hosted installs: install row created on first call to
--     `/api/cloud/register-install`. A synthetic Tenant row is auto-
--     created with `slug = "self-" + installId.slice(0,8)` so the rest
--     of the control plane (members, bind, unbind) works uniformly.
CREATE TABLE IF NOT EXISTS `installs` (
  `id`              TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `subscriptionId`  TEXT    DEFAULT '' NOT NULL,
  `tenantId`        TEXT    DEFAULT '' NOT NULL,
  `createdAt`       INTEGER
);
CREATE INDEX IF NOT EXISTS `install_subscription_idx` ON `installs` (`subscriptionId`);
CREATE INDEX IF NOT EXISTS `install_tenant_idx`       ON `installs` (`tenantId`);

-- Audit trail for provisioning orchestration.
CREATE TABLE IF NOT EXISTS `provision_events` (
  `id`         TEXT DEFAULT '' NOT NULL PRIMARY KEY,
  `tenantId`   TEXT DEFAULT '' NOT NULL,
  `event`      TEXT DEFAULT '' NOT NULL,
  `detail`     JSON DEFAULT '0' NOT NULL,
  `at`         INTEGER
);
CREATE INDEX IF NOT EXISTS `provision_events_tenant_idx` ON `provision_events` (`tenantId`, `at`);

-- Dodo webhook idempotency store.
CREATE TABLE IF NOT EXISTS `applied_events` (
  `id`           TEXT DEFAULT '' NOT NULL PRIMARY KEY,
  `dodoEventId`  TEXT DEFAULT '' NOT NULL,
  `eventType`    TEXT DEFAULT '' NOT NULL,
  `appliedAt`    INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS `applied_events_dodo_unique` ON `applied_events` (`dodoEventId`);

-- Newsletter signups from the marketing site. Public, unauthenticated
-- inserts via the generic `/api/[...remult]` endpoint.
CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id`        TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `email`     TEXT    DEFAULT '' NOT NULL,
  `source`    TEXT    DEFAULT '' NOT NULL,
  `status`    TEXT    DEFAULT 'active' NOT NULL,
  `createdAt` INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS `newsletter_subscribers_email_unique` ON `newsletter_subscribers` (`email`);
