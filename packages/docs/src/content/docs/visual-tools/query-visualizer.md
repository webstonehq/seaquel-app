---
title: Query Visualizer
description: See SQL queries as visual diagrams showing tables, joins, and filters.
---

The query visualizer parses your SQL and renders it as a diagram, making it easy to understand the structure of complex queries at a glance.

## Opening the visualizer

1. Write or open a query in the editor.
2. Click the **Visualize** tab above the editor.
3. The diagram renders automatically from your SQL.

## What it shows

The visualizer breaks your query into visual elements:

- **Source tables and subqueries** — each appears as a distinct node
- **JOIN types** — INNER, LEFT, RIGHT, FULL, and CROSS joins shown with their conditions
- **WHERE / HAVING filters** — filter conditions displayed alongside the relevant tables
- **GROUP BY and aggregations** — grouping columns and aggregate functions
- **ORDER BY** — sort specifications with direction
- **LIMIT / OFFSET** — row limiting displayed when present
- **DISTINCT** — flagged when the query uses DISTINCT
- **SELECT projections** — the final column list

## Supported statements

The visualizer works with:

- `SELECT` — full support including subqueries, CTEs, and set operations
- `INSERT` — shows target table and source data
- `UPDATE` — displays target table, SET assignments, and filter conditions
- `DELETE` — shows target table and WHERE conditions

## When to use it

- **Reviewing unfamiliar SQL** — understand someone else's query without reading it line by line
- **Debugging joins** — see which tables connect and how
- **Validating query logic** — confirm your query structure matches your intent before executing
