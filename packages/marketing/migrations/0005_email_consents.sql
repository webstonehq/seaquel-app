-- Email consent records for marketing contact.
--
-- One row per (email, purpose). `newsletter_subscribers` recorded who
-- signed up but never what they agreed to, and nothing could set its
-- `status` to 'unsubscribed'. This table carries its own proof of
-- consent and its own unsubscribe token, because outreach is sent
-- manually and there is no ESP to supply an unsubscribe link.
CREATE TABLE IF NOT EXISTS `email_consents` (
  `id`               TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `email`            TEXT    DEFAULT '' NOT NULL,
  -- 'research' | 'newsletter'. Separate rows so unsubscribing from one
  -- does not silently end the other.
  `purpose`          TEXT    DEFAULT '' NOT NULL,
  `status`           TEXT    DEFAULT 'active' NOT NULL,
  `source`           TEXT    DEFAULT '' NOT NULL,
  -- Verbatim wording shown at signup, resolved server-side.
  `consentText`      TEXT    DEFAULT '' NOT NULL,
  `consentedAt`      INTEGER,
  `consentIp`        TEXT    DEFAULT '' NOT NULL,
  `consentUserAgent` TEXT    DEFAULT '' NOT NULL,
  `unsubscribeToken` TEXT    DEFAULT '' NOT NULL,
  `unsubscribedAt`   INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS `email_consents_email_purpose` ON `email_consents` (`email`, `purpose`);
CREATE UNIQUE INDEX IF NOT EXISTS `email_consents_token`         ON `email_consents` (`unsubscribeToken`);
CREATE INDEX        IF NOT EXISTS `email_consents_purpose_status` ON `email_consents` (`purpose`, `status`);

-- Backfill existing newsletter signups. Their consent text is marked so
-- pre-capture rows stay visibly distinct from properly recorded ones.
-- `newsletter_subscribers` is left in place, unread, and dropped in a
-- later migration once this table is proven.
INSERT OR IGNORE INTO `email_consents` (
  `id`, `email`, `purpose`, `status`, `source`,
  `consentText`, `consentedAt`, `consentIp`, `consentUserAgent`, `unsubscribeToken`
)
SELECT
  lower(hex(randomblob(16))),
  `email`,
  'newsletter',
  `status`,
  `source`,
  '(pre-consent-capture; implied by form submission)',
  `createdAt`,
  '',
  '',
  lower(hex(randomblob(32)))
FROM `newsletter_subscribers`;
