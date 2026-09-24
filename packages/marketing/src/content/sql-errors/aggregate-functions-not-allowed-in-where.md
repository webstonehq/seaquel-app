---
title: "aggregate functions are not allowed in WHERE"
seoTitle: 'Fix "aggregate functions are not allowed in WHERE" (use HAVING) | Seaquel'
description: "Why COUNT, SUM and AVG can't go in WHERE, when to move the condition to HAVING, and how to compare rows against an aggregate with a subquery."
lesson: having
error: "aggregate functions are not allowed in WHERE"
broken: |
  SELECT category, COUNT(*) AS product_count
  FROM demo.products
  WHERE COUNT(*) > 2
  GROUP BY category;
fixed: |
  SELECT category, COUNT(*) AS product_count
  FROM demo.products
  GROUP BY category
  HAVING COUNT(*) > 2;
codes:
  postgresql: '42803'
  mysql: '1111'
  sql-server: '147'
messages:
  - engine: MySQL
    text: "ERROR 1111 (HY000): Invalid use of group function"
  - engine: SQL Server
    text: "Msg 147: An aggregate may not appear in the WHERE clause unless it is in a subquery contained in a HAVING clause or a select list, and the column being aggregated is an outer reference."
  - engine: DuckDB
    text: "Binder Error: WHERE clause cannot contain aggregates!"
  - engine: SQLite
    text: "misuse of aggregate: COUNT()"
---

You put `COUNT`, `SUM`, `AVG` or another aggregate in `WHERE`. `WHERE` runs before any grouping happens, so there's nothing to aggregate yet.

## Why it happens

The database processes a grouped query in a fixed order: `FROM`, then `WHERE`, then `GROUP BY`, then `HAVING`, then `SELECT`. The order you write the clauses in doesn't change that.

`WHERE` looks at one row at a time and decides whether to keep it. At that point there are no groups, so `COUNT(*)` has no meaning.

```sql
SELECT category, COUNT(*) AS product_count
FROM demo.products
WHERE COUNT(*) > 2
GROUP BY category;
```

The intent is clear: categories with more than two products. The condition is just in the wrong clause.

## How to fix it

**Filtering groups by an aggregate**: move the condition to `HAVING`, which runs after `GROUP BY`:

```sql
SELECT category, COUNT(*) AS product_count
FROM demo.products
GROUP BY category
HAVING COUNT(*) > 2;
```

Electronics and Accessories have five products each; Storage has two and drops out.

You can use both clauses in one query. `WHERE` filters rows before they're grouped and `HAVING` filters the groups afterwards:

```sql
SELECT category, COUNT(*) AS product_count
FROM demo.products
WHERE price < 50
GROUP BY category
HAVING COUNT(*) > 2;
```

Only Accessories has more than two products under 50.

**Comparing each row to an aggregate**: sometimes you don't want groups at all. You want rows compared against a total, such as products priced above average:

```sql
SELECT name, price
FROM demo.products
WHERE price > AVG(price);   -- same error
```

`HAVING` doesn't help here, because you want individual products, not categories. Compute the average in a subquery, which runs on its own and hands `WHERE` a single number:

```sql
SELECT name, price
FROM demo.products
WHERE price > (SELECT AVG(price) FROM demo.products)
ORDER BY price DESC;
```

Five products come back, from Headphones at 149.99 down to Laptop Stand at 59.99.

## Aliases in HAVING

PostgreSQL doesn't let `HAVING` refer to a `SELECT` alias:

```sql
SELECT category, COUNT(*) AS product_count
FROM demo.products
GROUP BY category
HAVING product_count > 2;   -- column "product_count" does not exist
```

Repeat the expression instead: `HAVING COUNT(*) > 2`. MySQL and DuckDB accept the alias, so a query copied from one of them can fail in PostgreSQL with [column "x" does not exist](/sql-errors/column-does-not-exist).
