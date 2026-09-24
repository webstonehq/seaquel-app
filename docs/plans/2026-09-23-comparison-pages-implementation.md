# Comparison and Alternative Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship nine prerendered pages targeting "Seaquel vs X" and "X alternative" queries, built on a content collection whose factual claims are source-linked and guarded by tests.

**Architecture:** One markdown content collection (`src/content/competitors/`) loaded via `import.meta.glob`, mirroring the existing `sql-errors` pattern. Facts live in frontmatter, prose in the body. Two route families render the same data with different framing: `/compare/[slug]` for "vs" intent, `/alternatives/[slug]` for replacement intent. A vitest suite enforces the honesty invariants.

**Tech Stack:** SvelteKit 2 + Svelte 5 runes, mdsvex, Tailwind v4, gray-matter (tests), vitest.

**Constraint:** This repo's instructions forbid the assistant running git operations. "Checkpoint" steps below mark good commit points for the human to commit.

---

## Design reference

See `docs/plans/2026-09-23-comparison-pages-design.md` for the validated design
and the full per-competitor research, verified 2026-09-23.

---

### Task 1: Types and loader

**Files:**
- Create: `src/lib/competitors/index.ts`

**Step 1: Define the types**

Mirror `src/lib/sql-errors/index.ts`. Key types:

```ts
export type CellValue = boolean | string;
export type PlatformSupport = "full" | "trails" | "none";

export interface ComparisonRow {
  feature: string;
  seaquel: CellValue;
  them: CellValue;
  note?: string;
  source: string;
}

export interface Concession {
  title: string;
  body: string;
}

export interface Competitor {
  slug: string;
  name: string;
  vendor: string;
  verifiedOn: string;
  seoTitle: string;
  description: string;
  altTitle: string;         // /alternatives page H1
  altDescription: string;
  sources: Record<string, string>;
  pricing: { model: string; summary: string; free: string };
  engineCount: number;
  engines: string[];
  platforms: Record<"macos" | "windows" | "linux", PlatformSupport>;
  license: string;
  chooseSeaquel: string[];  // verdict box, left column
  chooseThem: string[];     // verdict box, right column
  rows: ComparisonRow[];
  theyWinAt: Concession[];
  faq: Array<{ q: string; a: string }>;
  importer?: string;        // name of the in-app importer, if any
}
```

**Step 2: Write the loaders**

`getCompetitors()`, `getCompetitor(slug)` (returns `content` component too),
`getCompetitorSlugs()`. Copy the `import.meta.glob` shape from
`src/lib/sql-errors/index.ts:55-108` exactly — eager glob for the list,
lazy glob for the detail page.

**Step 3: Checkpoint** — `pnpm check` passes.

---

### Task 2: Honesty guard test (TDD — write before content)

**Files:**
- Create: `src/lib/competitors/content.test.ts`

**Step 1: Write the failing test**

Model it on `src/lib/sql-errors/content.test.ts:1-20` (node `readdirSync` +
`gray-matter`, not the Vite glob, so it runs outside the SvelteKit runtime).

```ts
const MAX_AGE_DAYS = 180;

describe.each(pages)("$slug", ({ slug, data }) => {
  it("has the required frontmatter", () => { /* every scalar field typed */ });

  it("concedes at least three things", () => {
    expect(data.theyWinAt?.length ?? 0).toBeGreaterThanOrEqual(3);
    for (const w of data.theyWinAt) {
      expect(w.title).toBeTypeOf("string");
      expect(w.body.length).toBeGreaterThan(40);
    }
  });

  it("sources every comparison row", () => {
    for (const row of data.rows) {
      expect(row.source, `${slug}: ${row.feature}`).toMatch(/^https:\/\//);
    }
  });

  it("was verified recently", () => {
    const age = (Date.now() - Date.parse(data.verifiedOn)) / 86_400_000;
    expect(age).toBeLessThan(MAX_AGE_DAYS);
  });
});
```

**Step 2: Run it to verify it fails**

Run: `pnpm test src/lib/competitors`
Expected: FAIL — content directory does not exist yet.

**Step 3: Checkpoint.**

---

### Task 3: Content — four competitors

**Files:**
- Create: `src/content/competitors/tableplus.md`
- Create: `src/content/competitors/dbeaver.md`
- Create: `src/content/competitors/datagrip.md`
- Create: `src/content/competitors/beekeeper-studio.md`

All facts come from the design doc's research section, verified 2026-09-23.
Non-negotiables, because each is a claim a reader can check in seconds:

- TablePlus: `$99–$129 perpetual`, Linux `trails` (NOT alpha — stable since
  Nov 2023), free tier permanent at 2 tabs/windows/filters.
- DBeaver: Community is Apache 2.0 and relational-only; Lite $113 /
  Enterprise $255 / Ultimate $510 per year.
- DataGrip: $109/yr personal, $259/yr commercial, **free for non-commercial
  use since 2025-10-01** — conceded in `chooseThem` and in the FAQ.
- Beekeeper: GPLv3 + commercial `src-commercial`; ~22 of 25 engines free.

Seaquel's own side: 6 engines (Postgres, MySQL, MariaDB, SQLite, SQL Server,
DuckDB), MIT source, commercial license required for work use.

**Step 1:** Write all four files.
**Step 2:** Run `pnpm test src/lib/competitors` — expected PASS.
**Step 3: Checkpoint.**

---

### Task 4: Shared components

**Files:**
- Create: `src/lib/components/compare/verdict-box.svelte`
- Create: `src/lib/components/compare/facts-grid.svelte`
- Create: `src/lib/components/compare/comparison-table.svelte`
- Create: `src/lib/components/compare/they-win.svelte`
- Create: `src/lib/components/compare/competitor-faq.svelte`

`comparison-table.svelte` renders `CellValue` with the same check/x/text
treatment as `src/lib/components/comparison-section.svelte:60-95`, plus a
superscript link to `row.source`.

`they-win.svelte` gets the same visual weight as the table — bordered cards,
not a bullet list. This is the section that earns the page its credibility.

`competitor-faq.svelte` emits `FAQPage` JSON-LD in `<svelte:head>`.

**Step:** `pnpm check` passes. **Checkpoint.**

---

### Task 5: `/compare` routes

**Files:**
- Create: `src/routes/compare/+page.svelte`, `+page.ts`
- Create: `src/routes/compare/[slug]/+page.svelte`, `+page.ts`

`+page.ts` files use `prerender = true` and an `EntryGenerator`, copied from
`src/routes/sql-errors/[slug]/+page.ts`.

Section order on the detail page: verdict box → facts → table → they-win →
performance → migration → FAQ → verifiedOn + sources.

**Step:** `pnpm check`, then `pnpm build` prerenders all five. **Checkpoint.**

---

### Task 6: `/alternatives` routes

**Files:**
- Create: `src/routes/alternatives/+page.svelte`, `+page.ts`
- Create: `src/routes/alternatives/[slug]/+page.svelte`, `+page.ts`

Same data, reordered: problem framing → Seaquel's answer → table →
concessions. Only competitors with `altTitle` set get a page, which keeps the
collection and the route list decoupled.

The long-tail page `/alternatives/tableplus-on-linux` is a distinct content
file whose `basedOn: tableplus` pulls the shared table but supplies its own
framing: the macOS-vs-Linux release cadence delta, dated and sourced.

**Step:** `pnpm build`. **Checkpoint.**

---

### Task 7: Correct the existing false claims

**Files:**
- Modify: `src/lib/components/comparison-section.svelte`
- Modify: `src/routes/+page.svelte` (SEO title)

Required corrections, per the design doc:

| Row | Current | Correct to |
|---|---|---|
| Price | `$0 - $229/year` | `$99 once – $510/year` |
| Visual Query Builder | `others: false` | `others: "Paid only"` |
| Native Performance | `others: false` | `others: "Varies"` |
| 100% Open Source | `others: "Partial"` | `others: "Varies"` |
| Memory / Startup | unsourced numbers | remove pending measurement |

SEO title gains SQL Server and DuckDB.

**Step:** `pnpm check`. **Checkpoint.**

---

### Task 8: Sitemap and navigation

**Files:**
- Modify: `src/routes/sitemap.xml/+server.ts`
- Modify: `src/lib/components/nav-header.svelte`

Add `/compare` and `/alternatives` to `STATIC_PATHS`, then loop the
competitor slugs for both families. Add a `Compare` nav link.

**Step:** `pnpm build`, confirm the URLs appear in the built sitemap.
**Checkpoint.**

---

### Task 9: Benchmark script

**Files:**
- Create: `scripts/benchmark-clients.md`

A documented manual procedure, not an automated script — measuring five GUI
apps' cold start and RSS cannot be honestly automated across three OSes. The
doc specifies: hardware to record, app versions, cold-start-to-first-paint
method, `ps`/Activity Monitor RSS at idle and after a 10k-row query, and the
results table to paste into each competitor's frontmatter.

Until it is run, performance rows stay out of the pages. The design doc
records this as an open question for the human.

**Step: Final checkpoint.**
