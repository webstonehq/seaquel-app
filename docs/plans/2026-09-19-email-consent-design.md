# Email collection and consent

Date: 2026-09-19
Status: approved, implementing

## Problem

The marketing site collects newsletter emails but never captures consent.
`newsletter_subscribers` stores `email`, `source`, `status`, `createdAt` — there is
no record of what anyone agreed to, no confirmation, and nothing can ever set
`status` to `unsubscribed`. The signup component also reports success when the
request fails, so failed signups are invisible.

Separately, a 30-day push needs a way to reach people who download Seaquel, to ask
for feedback and willingness to pay. That is a different purpose from the
newsletter and needs its own consent.

## Decisions

- Two purposes, tracked separately: `research` and `newsletter`.
- Ask for research consent on `/download`, below the platform grid. No gate on
  the download itself.
- Single opt-in. No confirmation email — nothing in the stack can send mail.
- Outreach is sent manually from a personal mailbox during the push. Volume is
  low enough that this beats building sending infrastructure, and it gets better
  reply rates for feedback.
- Every manual email carries a per-person unsubscribe link.

## Data model

Migration `0005_email_consents.sql`. One row per (email, purpose):

```sql
CREATE TABLE IF NOT EXISTS `email_consents` (
  `id`               TEXT    DEFAULT '' NOT NULL PRIMARY KEY,
  `email`            TEXT    DEFAULT '' NOT NULL,
  `purpose`          TEXT    DEFAULT '' NOT NULL, -- 'research' | 'newsletter'
  `status`           TEXT    DEFAULT 'active' NOT NULL,
  `source`           TEXT    DEFAULT '' NOT NULL,
  `consentText`      TEXT    DEFAULT '' NOT NULL,
  `consentedAt`      INTEGER,
  `consentIp`        TEXT    DEFAULT '' NOT NULL,
  `consentUserAgent` TEXT    DEFAULT '' NOT NULL,
  `unsubscribeToken` TEXT    DEFAULT '' NOT NULL,
  `unsubscribedAt`   INTEGER
);
CREATE UNIQUE INDEX `email_consents_email_purpose` ON `email_consents` (`email`, `purpose`);
CREATE UNIQUE INDEX `email_consents_token`         ON `email_consents` (`unsubscribeToken`);
```

Why each of the unusual columns exists:

- `consentText` — the verbatim sentence shown to the person, per row. Answers
  "what did they agree to" without digging through component history.
- `purpose` — unsubscribing from research must not kill the newsletter. Near
  impossible to retrofit once rows are mixed.
- `unsubscribeToken` — 32 random bytes, base64url. Manual sends have no ESP to
  provide an unsubscribe link, so each row carries its own.

The migration backfills `newsletter_subscribers` as `purpose='newsletter'` with
`consentText` set to `(pre-consent-capture; implied by form submission)` so
pre-existing rows are visibly distinct from properly captured ones. The old table
is left in place, unread, and dropped in a later migration.

## Endpoint

`POST /api/consent` replaces `POST /api/newsletter/subscribe`.

Consent wording lives server-side, keyed by purpose. The client sends `purpose`,
never the wording — otherwise arbitrary text can be written into a consent record
and the proof is worthless.

Behaviour:

1. `consent: true` is required in the body. Missing or false is a `400`.
   Submitting a form is not consent.
2. Duplicates upsert rather than being swallowed. If the existing row is
   `unsubscribed`, reactivate it with a fresh `consentedAt`/`consentIp`. If it is
   already active, leave the original consent record untouched — the first
   consent is the one worth proving. Both return the same response as a new
   signup, preserving the existing anti-enumeration behaviour.
3. Captures `consentIp` from `CF-Connecting-IP`, `consentUserAgent` truncated to
   256 chars, and a server-side `consentedAt`.

KV rate limit stays at 3 per 60s per IP, bucket renamed to `consent`.

## UI

New `$lib/components/consent-signup.svelte`, taking `purpose`, `source`, and copy
props. Used by both `/download` and the blog newsletter, so consent UI is defined
once. Nothing under `$lib/components/ui/` is modified.

- Checkbox is a native `<input type="checkbox" required>`, never pre-ticked.
  `required` gives browser-native blocking, and avoids adding a `Checkbox`
  primitive to `ui/`.
- Success state renders only on `res.ok`. Failures show an inline error with a
  retry. Duplicates still read as success because the server returns 200 — the
  right layer for that.
- On `/download` the card sits below the platform grid, always visible, with
  `source` of `download:<os>`.

Research copy: "Email me once or twice to ask how Seaquel is working for you and
what it's worth to you. No newsletter, no sales sequence — unsubscribe in one
click."

## Unsubscribe

`/unsubscribe?t=<token>` is a page, not an API call. `GET` renders a confirmation
with the email masked and a single button; the `POST` action flips `status` and
stamps `unsubscribedAt`.

The split matters: mail scanners and link prefetchers hit every URL in an email,
so a mutating `GET` unsubscribes people who never clicked. Unknown or already-used
tokens render the same confirmation-of-unsubscribe page — no enumeration, no
confusing error on a second click.

## Export

```bash
pnpm wrangler d1 execute SEAQUEL_DB --remote --json --command \
  "SELECT email, source, unsubscribeToken, consentedAt FROM email_consents
   WHERE purpose='research' AND status='active' ORDER BY consentedAt DESC"
```

Wrapped as `pnpm contacts:research`. No admin UI. Each person's
`https://seaquel.app/unsubscribe?t=...` goes into their email, along with a real
sender identity — the CAN-SPAM floor applies to one-off outreach as much as bulk.

## Tests

Vitest, already configured:

- rejects `consent: false` and missing consent
- rejects an unknown `purpose`
- stores server-side `consentText`, ignoring any client-supplied wording
- reactivates an unsubscribed row on re-opt-in
- leaves an active row's original `consentedAt` untouched
- unsubscribe `GET` mutates nothing; `POST` flips status

## Privacy page

Add a block covering what is collected (email, IP, user-agent, timestamp), why
(proof of consent), the two purposes, retention, and how to withdraw. The page
currently mentions email but not the consent record, and undisclosed IP storage
undercuts the point of keeping the records.
