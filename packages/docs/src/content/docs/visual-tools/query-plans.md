---
title: Query Plans
description: Visualize EXPLAIN and EXPLAIN ANALYZE output as interactive diagrams.
---

Seaquel renders query execution plans as interactive diagrams, making it straightforward to find bottlenecks and understand how the database executes your SQL.

## Running a plan

1. Write your query in the editor.
2. Click **EXPLAIN** in the toolbar to see the estimated plan, or **EXPLAIN ANALYZE** to execute the query and get actual metrics.
3. The plan renders as an interactive tree powered by SvelteFlow.

## Reading the plan tree

Each node in the tree represents an operation the database performs. Metrics shown per node include:

- **Estimated vs. actual cost** — compare what the planner predicted against reality
- **Row estimates vs. actual rows** — spot cardinality misestimates
- **Execution time** — how long each operation took (EXPLAIN ANALYZE only)
- **Index usage** — which indexes were used, if any
- **Filter and hash conditions** — conditions applied at each step
- **Loop counts** — how many times a nested loop executed

Planning time and total execution time are displayed at the top of the plan for quick reference.

## Hot path analysis

Seaquel automatically detects bottlenecks and highlights them with severity indicators:

- **Green** — performing well
- **Yellow** — moderate cost, worth reviewing
- **Red** — significant bottleneck, likely needs optimization

This lets you jump straight to the most expensive operations without reading the entire plan.

## Database support

Query plans are supported for:

- **PostgreSQL** — EXPLAIN and EXPLAIN ANALYZE
- **MySQL** — EXPLAIN and EXPLAIN ANALYZE

## Tips for optimization

- Compare estimated vs. actual rows — large gaps often indicate missing or stale statistics.
- Look for sequential scans on large tables where an index scan would be faster.
- Check loop counts on nested loops — high counts multiply the cost of inner operations.
- Run EXPLAIN ANALYZE to get real timing data, not just estimates.
