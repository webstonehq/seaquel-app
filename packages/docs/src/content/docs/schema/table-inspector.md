---
title: Table Inspector
description: View detailed column information, keys, indexes, and constraints.
---

The table inspector shows the full structural details of a table — columns, keys, indexes, and constraints — all in one place.

## Opening the inspector

1. Click a table in the [schema browser](/schema/schema-browser/).
2. The inspector panel displays the table's metadata.

## Column details

Each column shows:

- **Name** and **data type**
- **Nullability** — whether the column accepts NULL values
- **Default value** — the default expression, if one is set
- **Primary key badge** — marks columns that are part of the primary key
- **Foreign key badge** — marks columns that reference another table, with the referenced table name

## Indexes

The inspector lists all indexes on the table with:

- **Index name**
- **Columns** included in the index
- **Uniqueness** — whether the index enforces uniqueness
- **Type** — B-tree, hash, GIN, GiST, or other index types

## Constraints

View CHECK constraints, UNIQUE constraints, and exclusion constraints defined on the table.

## Canvas integration

Drag a table from the schema browser or inspector onto the [canvas](/visual-tools/canvas/) to create a table node. The node shows the same column and key information in a compact visual format, useful for building analysis workflows.
