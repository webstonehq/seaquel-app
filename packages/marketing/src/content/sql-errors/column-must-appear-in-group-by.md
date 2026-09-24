---
title: 'column "x" must appear in the GROUP BY clause or be used in an aggregate function'
seoTitle: 'Fix "must appear in the GROUP BY clause or be used in an aggregate function" | Seaquel'
description: "Why PostgreSQL rejects a column in SELECT that isn't grouped or aggregated, the MySQL only_full_group_by equivalent, and three ways to fix it."
lesson: group-by
error: 'column "products.name" must appear in the GROUP BY clause or be used in an aggregate function'
broken: |
  SELECT category, name, COUNT(*) AS product_count
  FROM demo.products
  GROUP BY category;
fixed: |
  SELECT
    category,
    COUNT(*) AS product_count,
    STRING_AGG(name, ', ' ORDER BY name) AS names
  FROM demo.products
  GROUP BY category;
codes:
  postgresql: '42803'
  mysql: '1055'
  sql-server: '8120'
messages:
  - engine: MySQL
    text: "ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP BY clause and contains nonaggregated column 'demo.products.name' which is not functionally dependent on columns in GROUP BY clause; this is incompatible with sql_mode=only_full_group_by"
  - engine: SQL Server
    text: "Msg 8120: Column 'demo.products.name' is invalid in the select list because it is not contained in either an aggregate function or the GROUP BY clause."
  - engine: DuckDB
    text: 'Binder Error: column "name" must appear in the GROUP BY clause or must be part of an aggregate function.'
  - engine: SQLite
    note: "No error. Returns the name from an arbitrary row in each group."
---

You grouped by one column and selected another that is neither grouped nor aggregated. The database can't pick a single value for it, so it refuses to run the query.

## Why it happens

`GROUP BY category` turns the twelve products into three rows, one per category. Every column in the output has to hold one value per category.

`category` has one value per group by definition. `COUNT(*)` reduces each group to a single number. `name` has five different values in the Electronics group, and nothing in the query says which one to show.

```sql
SELECT category, name, COUNT(*) AS product_count
FROM demo.products
GROUP BY category;
```

PostgreSQL names the offending column in the message, qualified with its table: `products.name`. Look at that column first. The query may have several like it, but the error only reports the first one.

## How to fix it

Decide what you want to see for that column in each group. There are three possible answers.

**You want one row per product.** You didn't mean to group by category alone. Add the column to `GROUP BY`:

```sql
SELECT category, name, COUNT(*) AS product_count
FROM demo.products
GROUP BY category, name;
```

This runs, but every group now holds one product, so every count is 1. If that's the output you want, you probably didn't need `GROUP BY`.

**You want a summary of the column.** Wrap it in an aggregate. `STRING_AGG` lists every value, and `MIN`, `MAX` or `COUNT(DISTINCT ...)` summarise them:

```sql
SELECT
  category,
  COUNT(*) AS product_count,
  STRING_AGG(name, ', ' ORDER BY name) AS names
FROM demo.products
GROUP BY category;
```

MySQL calls it `GROUP_CONCAT(name ORDER BY name SEPARATOR ', ')`. SQL Server has `STRING_AGG(name, ', ') WITHIN GROUP (ORDER BY name)`.

**You want the row behind a value**, such as the most expensive product in each category. `GROUP BY` can't do this: `MAX(price)` gives you the price but not the name next to it. Use a window function to rank rows inside each category, then keep the top one. See [window functions are not allowed in WHERE](/sql-errors/window-functions-not-allowed-in-where) for the full query. In PostgreSQL, `DISTINCT ON` is a shorter way to write it:

```sql
SELECT DISTINCT ON (category) category, name, price
FROM demo.products
ORDER BY category, price DESC;
```

## When grouping by the primary key is enough

PostgreSQL makes one exception. If you group by a table's primary key, you can select any other column from that table. The key determines each of those columns, so every group has exactly one value for them.

```sql
SELECT c.id, c.first_name, c.last_name, COUNT(o.id) AS orders
FROM demo.customers c
LEFT JOIN demo.orders o ON o.customer_id = c.id
GROUP BY c.id;
```

MySQL 5.7 and later accepts this too. SQL Server and DuckDB don't, so to be portable, list every selected column in `GROUP BY`.

## Why MySQL and SQLite used to let this through

Older MySQL versions ran the broken query and returned the name from any row in the group, usually the first one they read. MySQL 5.7 turned on `ONLY_FULL_GROUP_BY` by default, which produces error 1055 above. Legacy code sometimes disables that mode to make old queries run again. Doing so hides the bug rather than fixing it.

SQLite still allows it. It returns a value from one of the rows in the group, with no guarantee which one. The one useful special case is a query with a single `MIN()` or `MAX()`: SQLite then takes the other columns from the row that holds the minimum or maximum.
