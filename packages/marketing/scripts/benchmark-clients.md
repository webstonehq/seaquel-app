# Benchmarking SQL clients, honestly

The `/compare` pages deliberately carry **no** memory or startup figures today.
This document is the procedure for producing ones we can defend.

## Why this is a manual procedure

No vendor in this category — TablePlus, DBeaver, DataGrip, Beekeeper Studio or
us — publishes benchmark figures. Every number circulating in comparison
articles comes from content-marketing sites with no disclosed method, and
several are lead-generation pages for other database tools.

The GitHub issues people cite instead (DBeaver #38117, Beekeeper #2894) are real
but are single-user reports on unknown hardware after unknown usage. Quoting the
worst one you can find is cherry-picking, not measurement.

Measuring five GUI applications' cold start and resident memory across three
operating systems cannot be honestly automated, so this is a checklist for a
human rather than a script pretending to be one.

## What to record

Publish all of it, or publish nothing. A number without its conditions is
marketing.

- Machine: model, CPU, total RAM, OS version
- Every app's exact version, and the date tested
- Database: engine, version, whether local or remote, and the schema used
- Whether each app was a first launch or had existing connection state

## Procedure

Run each app through the full sequence, then repeat the whole sequence three
times and publish the **median**, not the best run.

### 1. Cold start to usable

Reboot between apps. This matters more than it sounds — OS file caching makes a
second launch unrepresentative, and it is the single easiest way to produce a
flattering number by accident.

1. Reboot.
2. Start a stopwatch and launch the app.
3. Stop when the connection list is interactive — not when the window appears.
   A window that has painted but does not yet accept input has not started.
4. Record seconds to one decimal place.

### 2. Resident memory at idle

With the app open and one connection established, no query run:

```bash
# macOS and Linux — RSS in MB, summed across the app's processes.
# Electron, Tauri and JVM apps all spawn helpers; counting only the main
# process understates every one of them, some far more than others.
ps -A -o rss=,comm= | awk '/[Ss]eaquel|DBeaver|TablePlus|Beekeeper|datagrip/ {s+=$1} END {print s/1024 " MB"}'
```

On Windows, use Task Manager's **Details** tab and sum the working set across
the app's processes.

### 3. Resident memory after a real query

Run a query returning ~10,000 rows against the same table in every app. Scroll
to the bottom of the result grid — virtualized grids do not materialize rows
until you look at them, and skipping this step rewards whichever app defers the
most work.

Wait 30 seconds, then re-measure as above.

## Publishing the result

Add to each competitor's frontmatter in `src/content/competitors/`:

```yaml
performance:
  measuredOn: "2026-10-01"
  machine: "MacBook Pro M3 Pro, 36GB, macOS 26.1"
  database: "PostgreSQL 17, local, 10k-row table"
  seaquel: { version: "2026.9.2", startup: 1.4, idleMb: 210, queryMb: 340 }
  them: { version: "26.10.22", startup: 0.9, idleMb: 180, queryMb: 290 }
```

Then render the section in `src/routes/compare/[slug]/+page.svelte`, replacing
the placeholder that currently explains why there are no numbers.

**If a competitor wins a row, publish it anyway.** A benchmark table where we
win everything is indistinguishable from one we made up, and readers treat it
the same way. The pages are built to be cited; a table that concedes two rows
out of six is worth more than a clean sweep nobody believes.
