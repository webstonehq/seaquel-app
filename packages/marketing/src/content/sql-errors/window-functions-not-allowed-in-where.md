---
title: "window functions are not allowed in WHERE"
seoTitle: 'Fix "window functions are not allowed in WHERE" (filter on ROW_NUMBER/RANK) | Seaquel'
description: "Why you can't filter on ROW_NUMBER or RANK in WHERE, how to wrap the query in a subquery or CTE to get the top row per group, and where QUALIFY works."
lesson: window
error: "window functions are not allowed in WHERE"
broken: |
  SELECT name, category, price
  FROM demo.products
  WHERE RANK() OVER (PARTITION BY category ORDER BY price DESC) = 1;
fixed: |
  SELECT name, category, price
  FROM (
    SELECT
      name, category, price,
      RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
    FROM demo.products
  ) ranked
  WHERE price_rank = 1;
codes:
  postgresql: '42P20'
  mysql: '3593'
  sql-server: '4108'
messages:
  - engine: MySQL
    text: "ERROR 3593 (HY000): You cannot use the window function 'rank' in this context.'"
  - engine: SQL Server
    text: "Msg 4108: Windowed functions can only appear in the SELECT or ORDER BY clauses."
  - engine: DuckDB
    text: "Binder Error: WHERE clause cannot contain window functions!"
  - engine: SQLite
    text: "misuse of window function RANK()"
---

You filtered on `ROW_NUMBER()`, `RANK()` or another window function in `WHERE`. Window functions are computed after `WHERE` has already decided which rows to keep, so their values aren't available there.

## Why it happens

A window function looks at the rows around the current one: the rank of this product among its category, the running total up to this order. That only works once the set of rows is final. The database therefore computes window functions near the end, after `FROM`, `WHERE`, `GROUP BY` and `HAVING`, just before `ORDER BY`.

`WHERE` would be filtering on a value that depends on which rows `WHERE` keeps. That's circular, so it's banned.

```sql
SELECT name, category, price
FROM demo.products
WHERE RANK() OVER (PARTITION BY category ORDER BY price DESC) = 1;
```

The same rule applies to `HAVING` and `GROUP BY`. In `HAVING` you get the matching error, window functions are not allowed in HAVING.

## How to fix it

Compute the window function in an inner query, give it an alias, and filter on the alias in an outer query. By the time the outer `WHERE` runs, the rank is an ordinary column.

This is the standard "top row per group" query: the most expensive product in each category.

```sql
SELECT name, category, price
FROM (
  SELECT
    name, category, price,
    RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
  FROM demo.products
) ranked
WHERE price_rank = 1;
```

Laptop Stand, Headphones and External SSD 1TB come back, one per category. Change the filter to `price_rank <= 2` for the top two in each.

A CTE is the same query with the steps in reading order:

```sql
WITH ranked AS (
  SELECT
    name, category, price,
    RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
  FROM demo.products
)
SELECT name, category, price
FROM ranked
WHERE price_rank = 1;
```

## RANK or ROW_NUMBER

Pick based on what should happen with ties. If two products in a category share the top price, `RANK()` gives both rank 1 and both come back. `ROW_NUMBER()` numbers them 1 and 2 arbitrarily, and exactly one comes back. Add a tie-breaker to `ORDER BY`, such as `price DESC, id`, if you use `ROW_NUMBER()` and need the result to be the same every time.

## QUALIFY

DuckDB, Snowflake and BigQuery have a `QUALIFY` clause, which filters on window functions the way `HAVING` filters on aggregates. It removes the need for the subquery:

```sql
SELECT name, category, price
FROM demo.products
QUALIFY RANK() OVER (PARTITION BY category ORDER BY price DESC) = 1;
```

PostgreSQL, MySQL, SQL Server and SQLite don't support it. Use the subquery there.
