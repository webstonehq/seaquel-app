---
title: "division by zero"
seoTitle: 'Fix "division by zero" in SQL with NULLIF | Seaquel'
description: "Why PostgreSQL and SQL Server stop on a zero divisor while MySQL, SQLite and DuckDB return NULL, and how NULLIF makes averages and ratios safe."
lesson: aggregates
error: "division by zero"
broken: |
  SELECT
    c.first_name,
    COUNT(o.id) AS orders,
    COALESCE(SUM(o.total_amount), 0) / COUNT(o.id) AS avg_order_value
  FROM demo.customers c
  LEFT JOIN demo.orders o ON o.customer_id = c.id
  GROUP BY c.id, c.first_name
  ORDER BY c.id;
fixed: |
  SELECT
    c.first_name,
    COUNT(o.id) AS orders,
    ROUND(COALESCE(SUM(o.total_amount), 0) / NULLIF(COUNT(o.id), 0), 2) AS avg_order_value
  FROM demo.customers c
  LEFT JOIN demo.orders o ON o.customer_id = c.id
  GROUP BY c.id, c.first_name
  ORDER BY c.id;
codes:
  postgresql: '22012'
  mysql: '1365'
  sql-server: '8134'
messages:
  - engine: SQL Server
    text: "Msg 8134: Divide by zero error encountered."
  - engine: Oracle
    text: "ORA-01476: divisor is equal to zero"
  - engine: MySQL
    note: "No error by default. Returns NULL with a warning."
  - engine: SQLite
    note: "No error. Returns NULL."
  - engine: DuckDB
    note: "No error. Returns NULL."
---

Some row divided by zero. PostgreSQL treats that as an error and aborts the whole query, even if only one row out of millions had a zero divisor.

## Why it happens

The divisor is almost never a literal `0`. It's a count, a total or a column that happens to be zero for a few rows. In ratios and averages, the usual cause is a group with nothing in it.

```sql
SELECT
  c.first_name,
  COUNT(o.id) AS orders,
  COALESCE(SUM(o.total_amount), 0) / COUNT(o.id) AS avg_order_value
FROM demo.customers c
LEFT JOIN demo.orders o ON o.customer_id = c.id
GROUP BY c.id, c.first_name
ORDER BY c.id;
```

Iris and Jack have never placed an order. The `LEFT JOIN` keeps them, `COUNT(o.id)` is 0 for both, and dividing by it fails. Eight customers would have produced a perfectly good average; two stop the query.

The `COALESCE` matters here. Without it, `SUM` returns NULL for Iris and Jack, and NULL divided by zero is NULL rather than an error. Anything that turns a missing value into 0 before the division, as `COALESCE` does, can surface this error.

## How to fix it

Wrap the divisor in `NULLIF(divisor, 0)`. `NULLIF` returns NULL when its two arguments are equal, so a zero divisor becomes NULL, and dividing by NULL gives NULL instead of an error:

```sql
SELECT
  c.first_name,
  COUNT(o.id) AS orders,
  ROUND(COALESCE(SUM(o.total_amount), 0) / NULLIF(COUNT(o.id), 0), 2) AS avg_order_value
FROM demo.customers c
LEFT JOIN demo.orders o ON o.customer_id = c.id
GROUP BY c.id, c.first_name
ORDER BY c.id;
```

Iris and Jack now get NULL, which is honest: they have no average order value. If a report needs a number, wrap the whole expression in `COALESCE(..., 0)`. Only do that when 0 is actually correct. For an average, it usually isn't.

A `CASE` expression does the same job and is sometimes easier to read:

```sql
CASE WHEN COUNT(o.id) = 0 THEN 0
     ELSE ROUND(SUM(o.total_amount) / COUNT(o.id), 2)
END AS avg_order_value
```

## Use AVG when you're computing an average

Dividing a sum by a count by hand is the long way round. `AVG` ignores NULLs, returns NULL for an empty group, and never divides by zero:

```sql
SELECT c.first_name, ROUND(AVG(o.total_amount), 2) AS avg_order_value
FROM demo.customers c
LEFT JOIN demo.orders o ON o.customer_id = c.id
GROUP BY c.id, c.first_name
ORDER BY c.id;
```

Same numbers, and no divisor to guard. Keep `NULLIF` for ratios `AVG` can't express, such as shipped orders as a share of all orders.

## Engines that return NULL instead

MySQL, SQLite and DuckDB return NULL for `x / 0` and carry on. The broken query above runs on all three, and Iris and Jack get NULL.

That's convenient, but a silent NULL can end up in a dashboard nobody checks. The `NULLIF` version behaves the same on every engine, so it's worth writing even where you don't need it.
