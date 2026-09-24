# SQL error codes for PostgreSQL, MySQL, SQLite and SQL Server

## Goal

/sql-errors only covers PostgreSQL. Extend it to the other engines Seaquel
supports, and publish each engine's full list of error codes, to catch searches
like "mysql error 1054" and "sqlstate 42703".

## Structure: two tiers

- **Guides** (unchanged URLs, `/sql-errors/{slug}`): the hand-written pages
  with a PGlite sandbox.
- **Code reference** (generated): `/sql-errors/{engine}` lists every code, and
  `/sql-errors/{engine}/{code}` covers a single code. Engines are `postgresql`,
  `mysql`, `sqlite` and `sql-server`.

## Data

`packages/marketing/scripts/fetch-sql-error-codes.ts` (`pnpm errors:update`)
downloads the official lists and writes `src/content/sql-error-codes/{engine}.json`.
The build never fetches anything.

| Engine     | Source                                               | Kept                                      |
| ---------- | ---------------------------------------------------- | ----------------------------------------- |
| PostgreSQL | postgresql.org/docs/current/errcodes-appendix.html   | SQLSTATE, condition name, class           |
| MySQL      | dev.mysql.com server + client error reference (8.4)  | number, symbol, SQLSTATE, message         |
| SQLite     | sqlite.org/rescode.html                              | number, name, primary/extended, description |
| SQL Server | MicrosoftDocs/sql-docs markdown (SQL Server 2025 tables) | number, severity, message; severity 11–16, numbers below 10000; explanation from the per-error article where one exists |

Record shape: `{ code, name?, message?, sqlstate?, category, description? }`.

Guides gain an optional `codes` frontmatter map (`postgresql: '42703'`,
`mysql: '1054'`, ...) that links the two tiers in both directions.

## Routes

A param matcher (`src/params/engine.ts`) keeps `/sql-errors/[engine=engine]`
from colliding with `/sql-errors/[slug]`. Everything is prerendered from
`+page.server.ts` loads, so no engine's full JSON is shipped to the client.

The code page shows the identifier and message, a facts table, the official
description (if the source has one), the guide card (if a guide maps to it),
equivalents in other engines (from guide maps and exact SQLSTATE matches), and
other codes in the same class.

The engine index lists all codes grouped by class, with row anchors. It has
no filter box: the page is `csr = false`, and browser find does the job.

## Indexing

`Seo` gains a `noindex` prop. A code page is indexable only if a guide maps to
it or the source provides a description. All other code pages are
`noindex,follow` and are left out of the sitemap. llms.txt lists only the
four engine indexes.

## Risks

- Cloudflare's static asset limit (20,000 files per version on free). The
  build produces 14,017 files: SvelteKit writes a __data.json beside every
  page with a server load, even with `csr = false`.
- Output size. The new pages add about 510 MB, mostly the site shell's inline
  SVGs repeated on every page. A change to shared CSS or JS changes every page
  and re-uploads them all.
- An upstream HTML change breaking a parser. Tests assert non-empty lists and
  known anchor codes.

## Tests

- Engine JSON: non-empty, unique codes, required fields, anchor codes present.
- Every code in a guide `codes` map exists in its engine's JSON.
- No guide slug equals an engine slug.
- `pnpm check`, `pnpm build`, spot-check robots meta and the sitemap.
