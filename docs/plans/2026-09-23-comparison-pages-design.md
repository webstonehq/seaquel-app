# Comparison and alternative pages — design

Date: 2026-09-23
Status: design validated, not yet implemented

## Goal

Rank for, and be cited by AI answers on, the highest-intent queries in this
market: "Seaquel vs TablePlus", "DBeaver alternative", "TablePlus alternative
for Linux". People searching these are the closest to switching.

The constraint that shapes every decision below: **the pages only work if they
are honest.** A comparison page that scores every competitor ✗ is dismissed by
readers and is worthless as a citation source. Conceding where competitors are
better is not a cost of these pages — it is the mechanism that makes the rest
of the table believable.

## Routes

Two collections over one data source. `/compare/*` serves "vs" intent;
`/alternatives/*` serves "replacement" intent. Separate pages avoid making one
page compete with itself for two different queries.

```
/compare                                     index, all rivals
/compare/tableplus
/compare/dbeaver
/compare/datagrip
/compare/beekeeper-studio

/alternatives                                index
/alternatives/tableplus
/alternatives/dbeaver
/alternatives/tableplus-on-linux             flagship long tail
```

Nine pages in batch one. More OS-qualified long-tail pages only after Search
Console shows which of these earns impressions — a matrix of near-duplicate
pages is what gets demoted as doorway content.

## Data model

One content collection, following the existing `sql-errors` pattern exactly
(`import.meta.glob` over `src/content/`, a typed loader in `src/lib/`,
prerendered routes with an `EntryGenerator`).

```
src/content/competitors/
  tableplus.md
  dbeaver.md
  datagrip.md
  beekeeper-studio.md

src/lib/competitors/
  index.ts          loader + types
  content.test.ts   honesty guards
```

Facts live in frontmatter; prose lives in the markdown body. This split exists
so the facts are mechanically checkable and re-verifiable on a schedule, while
the prose stays pleasant to edit.

```yaml
name: TablePlus
slug: tableplus
vendor: TablePlus Inc.
verifiedOn: "2026-09-23"
sources:
  pricing: https://tableplus.com/pricing
  platforms: https://tableplus.com/linux/changelog
pricing:
  model: perpetual            # perpetual | subscription | open-core
  summary: "$99–$129 one-time, includes 1 year of updates"
  free: "Permanent free tier, capped at 2 tabs / 2 windows / 2 filters"
engines: [postgres, mysql, sqlite, mssql, mongodb, redis, ...]
platforms:
  macos: full
  windows: full
  linux: trails               # full | trails | none
rows:
  - feature: SSH tunnelling
    seaquel: true
    them: true
    source: https://tableplus.com/
theyWinAt:                    # minimum 3, enforced
  - title: Engine breadth
    body: "~15 engines including MongoDB, Cassandra, Redis, Snowflake and
           BigQuery. Seaquel supports 6."
```

### Honesty guards (`content.test.ts`)

Enforced at build time, so the honesty cannot quietly erode later:

- `theyWinAt.length >= 3` for every competitor
- every row in `rows` has a `source` URL
- `verifiedOn` is within the last 180 days

The third guard will eventually fail the build. That is the point — vendor
pricing moves, and a stale price is the single fastest way to lose the
reader's trust.

## Page anatomy

`/compare/[slug]`, in order:

1. **Verdict box** — "Choose Seaquel if… / Choose <them> if…", two columns,
   honest on both sides, above the fold. This is the block AI answers lift, so
   it carries the summary rather than burying it.
2. **At-a-glance facts** — price, license, engine count, platforms, both sides.
3. **Comparison table** — every row carries a source URL.
4. **Where <them> is better** — the `theyWinAt` block, same visual weight as
   the table, not a footnote.
5. **Performance, measured** — our numbers, our hardware, versions, method,
   linked to the benchmark script in the repo.
6. **Migration** — Seaquel already ships importers for TablePlus and DBeaver
   (`src/lib/services/tableplus-import.ts`). A concrete conversion step is
   something most comparison pages cannot offer.
7. **FAQ** with `FAQPage` JSON-LD.
8. `verifiedOn` date and full source list.

`/alternatives/[slug]` reuses the same data, reordered: problem framing first,
then Seaquel's answer, then table, then concessions.

## Performance claims

No vendor in this market publishes memory or startup figures. Everything
circulating is either undated third-party content marketing or cherry-picked
GitHub issues. Citing those would put us in the same category.

Instead: a benchmark script in the repo, run once across all five apps on one
machine, publishing cold-start-to-first-paint, RSS at idle, and RSS after a
10k-row query, together with hardware, app versions and method. Reproducible
numbers with a disclosed method are the most citable asset these pages can
carry.

## Research findings that change existing site copy

All facts below were verified against vendor sources on 2026-09-23.

### The homepage comparison table has false rows

`src/lib/components/comparison-section.svelte` needs correcting as part of this
work:

- **"Price: Others $0 – $229/year"** is wrong for every competitor. DataGrip is
  $109/yr personal and $259/yr commercial. DBeaver runs to $510/yr (Ultimate).
  TablePlus is $99–$129 *perpetual*, not a subscription at all.
- **"Visual Query Builder: Others ✗"** is false. DBeaver has one from Lite up.
- **"Native Performance: Others ✗"** is false. TablePlus is a genuinely native
  app (Swift/ObjC on macOS, C# on Windows).
- **"100% Open Source: Others Partial"** overstates our position. Seaquel is
  MIT, but the commercial-license-required policy sits on top of that license —
  exactly as Beekeeper's does. DBeaver Community is Apache 2.0. This row should
  be a tie.
- `~200MB` / `<2 seconds` are unsourced and should be replaced with measured
  figures or removed.

### Seaquel is undersold

The product supports **6 engines** — Postgres, MySQL, MariaDB, SQLite, SQL
Server and DuckDB (`crates/seaquel-db/src/lib.rs`). The homepage SEO title
claims only "Postgres, MySQL & SQLite". Fix alongside these pages.

### Per-competitor headlines

**TablePlus** — $99–$129 perpetual with 1 year of updates; permanent free tier
(2 tabs / 2 windows / 2 filters); ~15 engines. Linux was relabelled *stable* in
Nov 2023, so the widespread "TablePlus Linux is alpha" claim is stale and must
not be used. The real, defensible gap: Linux runs a separate 1.x version line
at roughly monthly cadence against macOS's near-weekly 26.x line, and as of the
Aug 2026 Linux changelog lacks ElasticSearch, Mongo Shell, custom themes, code
folding, cell selection and Entra ID login. Redis reached Linux only in June
2026. Open parity bugs: #280, #276. They win on: engine breadth, iOS app, JS
plugin API, ~decade of maturity.

**DBeaver** — Community is Apache 2.0 and genuinely open source, but
relational-only. Paywalled: all NoSQL engines, visual query builder, mock data,
schema compare, ETL/task scheduling, Git sync. Lite $113 / Enterprise $255 /
Ultimate $510 per year. They win on: 100+ drivers against our 6, free OSS
Community edition, CloudBeaver web edition, SSO and team governance, 15 years
of maturity.

**DataGrip** — $109/yr personal ($87 yr 2, $65 yr 3+), $259/yr commercial.
**Free for non-commercial use since 1 Oct 2025**, which removes "free for
personal use" as a differentiator against them; the pages concede this plainly
and compete on MIT source, no mandatory telemetry, and offline activation. They
win on: SQL resolved against the live schema, rename refactoring propagated to
the datasource, static error detection before execution, schema diff and
migration scripts, scriptable Groovy/JS extractors, bundled VCS. Their
weakness is weight, evidenced by JetBrains' own four standing troubleshooting
docs for slow startup, high memory, high CPU and slow indexing.

**Beekeeper Studio** — GPLv3 with a separate commercial license for
`src-commercial` directories. Community is strong: unlimited connections, no
tab limits, ~22 of 25 engines free including MongoDB, ClickHouse, Snowflake,
BigQuery and Redis. Only Oracle, Cassandra and ScyllaDB are paid-gated. Paid
tiers $9–$18/user/month annually. They win on: free-tier breadth, engine count,
maturity, install-format coverage. Memory complaints exist but only as dated
user reports (issues #2894, #479, #263) and must be cited as such.

## Supporting changes

- `src/routes/sitemap.xml/+server.ts` — add both indexes and all detail pages
- `src/lib/components/nav-header.svelte` — link `/compare`
- `src/lib/components/comparison-section.svelte` — correct the false rows,
  link through to `/compare`
- Homepage SEO title — reflect all 6 engines

## Open questions

- Which machine the benchmark runs on, and whether numbers get re-measured per
  release or per quarter
- Whether `/alternatives/tableplus-on-linux` is the right slug, versus the more
  literal `tableplus-alternative-for-linux`
