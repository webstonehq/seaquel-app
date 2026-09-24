---
title: "each UNION query must have the same number of columns"
seoTitle: 'Fix "each UNION query must have the same number of columns" in SQL | Seaquel'
description: "Why UNION needs both queries to return the same number of columns with compatible types, how to line them up, and when to use UNION ALL instead."
error: "each UNION query must have the same number of columns"
broken: |
  SELECT first_name, last_name, email
  FROM demo.customers
  UNION
  SELECT name, category
  FROM demo.products;
fixed: |
  SELECT first_name || ' ' || last_name AS label, 'customer' AS kind
  FROM demo.customers
  UNION ALL
  SELECT name, 'product'
  FROM demo.products;
codes:
  postgresql: '42601'
  mysql: '1222'
  sql-server: '205'
messages:
  - engine: MySQL
    text: "ERROR 1222 (21000): The used SELECT statements have a different number of columns"
  - engine: SQL Server
    text: "Msg 205: All queries combined using a UNION, INTERSECT or EXCEPT operator must have an equal number of expressions in their target lists."
  - engine: Oracle
    text: "ORA-01789: query block has incorrect number of result columns"
  - engine: DuckDB
    text: "Binder Error: Set operations can only apply to expressions with the same number of result columns"
  - engine: SQLite
    text: "SELECTs to the left and right of UNION do not have the same number of result columns"
---

`UNION` stacks the rows of one query under the rows of another. For that to work, both queries have to return the same number of columns, so each row lines up with the columns above it. Yours don't.

## Why it happens

The first query returns three columns, the second returns two:

```sql
SELECT first_name, last_name, email
FROM demo.customers
UNION
SELECT name, category
FROM demo.products;
```

A product row has nothing to put in the third column, and the database won't guess. Columns are matched by position, not by name, so it doesn't matter what they're called. The same rule applies to `INTERSECT` and `EXCEPT`.

## How to fix it

Make both sides return the same columns, in the same order. Either drop the extra column from the longer side, or pad the shorter side with a literal or `NULL`:

```sql
SELECT first_name, last_name, email
FROM demo.customers
UNION
SELECT name, category, NULL
FROM demo.products;
```

That runs, but look at the output: product names now sit in a column called `first_name`, and categories in `last_name`. The result takes its column names from the first query. Usually it's better to reshape both sides into columns that mean the same thing:

```sql
SELECT first_name || ' ' || last_name AS label, 'customer' AS kind
FROM demo.customers
UNION ALL
SELECT name, 'product'
FROM demo.products;
```

Twenty-two rows: ten customers and twelve products, each tagged with where it came from.

`SELECT *` on either side is a common way to end up here. The query works until someone adds a column to one of the tables. List the columns explicitly.

## The types have to match too

Matching the count isn't always enough. Each column position also needs compatible types on both sides:

```sql
SELECT id FROM demo.customers
UNION
SELECT name FROM demo.products;
-- ERROR:  UNION types integer and character varying cannot be matched
```

Cast one side so they agree, for example `id::text`, or rethink whether those columns belong in the same position.

## UNION or UNION ALL

`UNION` removes duplicate rows from the combined result. `UNION ALL` keeps every row and skips the work of deduplicating. Every customer id appears in `demo.customers`, and eight of them also appear in `demo.orders`, so the difference shows up quickly:

```sql
SELECT customer_id FROM demo.orders
UNION
SELECT id FROM demo.customers;        -- 10 rows

SELECT customer_id FROM demo.orders
UNION ALL
SELECT id FROM demo.customers;        -- 20 rows
```

Use `UNION ALL` unless you actually want duplicates removed. It's faster, and it doesn't quietly drop rows that happen to be identical.
