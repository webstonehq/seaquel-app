---
title: Query Builder
description: Build SQL visually with drag-and-drop tables, joins, and filters.
---

The Query Builder lets you construct SQL queries on a visual canvas. Drag tables, draw joins, and configure filters — Seaquel generates the SQL in real time.

## Opening the Query Builder

1. Open a new query tab.
2. Switch to the **Builder** view in the editor toolbar.

## Building a query

### Add tables

Drag tables from the sidebar onto the canvas. Each table appears as a node showing its columns.

### Connect joins

Draw a line from a column on one table to a column on another to create a JOIN. Click the join connector to choose the join type (INNER, LEFT, RIGHT, FULL).

### Configure filters

Add WHERE clauses by selecting columns and setting conditions. Combine multiple filters with boolean operators (AND / OR).

### Aggregations

Apply aggregate functions to columns: COUNT, SUM, AVG, MIN, MAX. Seaquel automatically adds the appropriate GROUP BY clause.

### Variables

Use `{{variables}}` in filter values and LIMIT clauses. Variables are prompted for values at execution time, just like [query parameters](/docs/editor/query-parameters/).

### Expand wildcards

If your query uses `SELECT *`, click the expand button to replace the wildcard with an explicit list of column names.

## Two-way SQL sync

The visual canvas and the SQL editor stay in sync. Edit on the canvas and watch the SQL update instantly. Switch to the SQL view, make a change, and the canvas reflects it. Work in whichever mode fits the task.

## Why use the Query Builder

- **Learning** — see how SQL clauses relate to each other visually
- **Exploration** — quickly prototype queries against unfamiliar schemas
- **Complex joins** — visualize multi-table relationships before committing to SQL
