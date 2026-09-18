-- Record when a license left `active`, so the air-gap bundle grace window
-- is anchored to the cancellation instead of to "now" (which let a
-- cancelled customer keep re-downloading fresh 7-day bundles forever).
-- Mirrors `License.canceledAt` in `src/lib/entities/license.ts`.
--
-- Apply locally:    wrangler d1 migrations apply SEAQUEL_DB --local
-- Apply to prod:    wrangler d1 migrations apply SEAQUEL_DB --remote

ALTER TABLE `licenses` ADD COLUMN `canceledAt` INTEGER;
