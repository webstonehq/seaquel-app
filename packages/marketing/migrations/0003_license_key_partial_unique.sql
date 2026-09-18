-- Make `licenses.licenseKey` unique only for non-empty keys.
--
-- The Dodo webhook's `subscription.active` handler inserts one
-- placeholder row per seat with `licenseKey = ''` before the matching
-- `license_key.created` events arrive. The plain UNIQUE index from
-- 0001_init.sql treats every '' as a duplicate, so any multi-seat
-- purchase (or two purchases whose keys haven't landed yet) failed on
-- the second placeholder insert.
--
-- Apply locally:    wrangler d1 migrations apply SEAQUEL_DB --local
-- Apply to prod:    wrangler d1 migrations apply SEAQUEL_DB --remote

DROP INDEX IF EXISTS `licenses_key_unique`;
CREATE UNIQUE INDEX IF NOT EXISTS `licenses_key_unique`
  ON `licenses` (`licenseKey`) WHERE `licenseKey` != '';
