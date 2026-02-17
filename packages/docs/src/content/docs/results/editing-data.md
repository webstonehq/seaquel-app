---
title: Editing Data
description: Edit cell values directly in the result grid.
---

Seaquel lets you edit data inline without writing UPDATE statements by hand.

## Inline editing

1. Run a SELECT query against a table.
2. Click any cell in the result grid to enter edit mode.
3. Modify the value.
4. Confirm the edit.

Seaquel auto-generates and executes the UPDATE statement for you, targeting the correct row using primary key columns.

## How it works

- **Primary key identification** — Seaquel detects the table's primary key to build a precise WHERE clause, ensuring only the intended row is updated.
- **Source table tracking** — the editor tracks which table each column belongs to, so it generates accurate UPDATE statements even for queries with aliases.
- **Immediate application** — changes are applied to the database as soon as you confirm the edit.

## Requirements

Inline editing works with tables that have a primary key defined. Without a primary key, Seaquel cannot guarantee it will target the correct row, so editing is disabled for those results.
