---
title: DuckDB
description: Connect to DuckDB for embedded analytics in Seaquel.
---

DuckDB is a fast, embedded analytics database. Seaquel provides full DuckDB support in the desktop app.

## Connecting

1. Click **New Connection** and select **DuckDB**.
2. Choose a database file, or leave empty for an in-memory database.
3. Click **Save & Connect**.

## Use cases

- **CSV/Parquet analytics** — query files directly with DuckDB's built-in readers
- **Embedded analytics** — fast OLAP queries without a server
- **Data exploration** — import and analyze datasets locally

## Features

DuckDB connections support:

- Full SQL with analytical functions (window functions, CTEs, etc.)
- [Statistics dashboard](/schema/statistics/) with database metrics
- Schema browser with tables and views
- All [export formats](/results/exporting/) (CSV, JSON, SQL, Markdown)
