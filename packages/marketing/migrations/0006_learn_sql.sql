-- Progress and certificates for the /learn-sql course.
--
-- Progress lives in localStorage while someone works through the lessons, so
-- the course needs no account. These tables are only written when a learner
-- claims a certificate, at which point `Certificate.claim` merges the browser
-- state into their account and verifies it server-side.
--
-- Column shapes follow Remult's SQLite conventions, as documented in
-- 0001_init.sql: strings default to '', dates are epoch ms INTEGER, and JSON
-- columns default to '0' (a Remult quirk, not a typo).

CREATE TABLE IF NOT EXISTS `learn_sql_progress` (
  `id`                   TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `userId`               TEXT    DEFAULT '' NOT NULL,
  -- Lesson slug, e.g. 'joins'.
  `lessonSlug`           TEXT    DEFAULT '' NOT NULL,
  -- JSON array of solved challenge ids, mirroring the localStorage shape.
  `solvedChallengeIds`   JSON    DEFAULT '0' NOT NULL,
  `createdAt`            INTEGER,
  `updatedAt`            INTEGER
);

-- One row per (user, lesson); the claim path upserts against this pair.
CREATE UNIQUE INDEX IF NOT EXISTS `learn_sql_progress_user_lesson`
  ON `learn_sql_progress` (`userId`, `lessonSlug`);

CREATE TABLE IF NOT EXISTS `learn_sql_certificates` (
  -- Also the public URL segment: /learn-sql/certificate/<id>.
  `id`              TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `userId`          TEXT    DEFAULT '' NOT NULL,
  `name`            TEXT    DEFAULT '' NOT NULL,
  `challengeCount`  INTEGER DEFAULT 0 NOT NULL,
  `lessonCount`     INTEGER DEFAULT 0 NOT NULL,
  `issuedAt`        INTEGER
);

-- A learner holds at most one certificate; claiming again returns it.
CREATE UNIQUE INDEX IF NOT EXISTS `learn_sql_certificates_user`
  ON `learn_sql_certificates` (`userId`);
