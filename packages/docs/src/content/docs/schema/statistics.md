---
title: Statistics
description: Monitor database size, table metrics, and index usage.
---

The statistics view gives you a high-level overview of your database's size, table metrics, and index efficiency. Use it to find optimization opportunities without writing diagnostic queries.

## Database overview

At the top, you'll see:

- **Database name**
- **Total size** on disk
- **Table count**
- **Index count**
- **Active connections**

## Table size analysis

A breakdown of every table showing:

- **Row count** — number of rows in the table
- **Total size** — combined data and index size
- **Data size** — size of the table data alone
- **Index size** — size of all indexes on the table

Sort by any column to quickly find your largest tables.

## Index usage monitoring

For each index, Seaquel shows:

- **Scans performed** — how many times the index has been used
- **Rows read** — how many rows the index has returned
- **Unused index detection** — indexes with zero scans are flagged so you can evaluate whether to drop them

Unused indexes consume disk space and slow down writes without benefiting reads.

## Database support

Statistics are available for:

- **PostgreSQL** — full support for all metrics
- **DuckDB** — database and table size metrics

## Accessing statistics

Open statistics from the sidebar or through the command palette (`Cmd+K` / `Ctrl+K`, then search for "Statistics").
