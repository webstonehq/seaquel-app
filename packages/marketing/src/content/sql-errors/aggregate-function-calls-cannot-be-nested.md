---
title: "aggregate function calls cannot be nested"
seoTitle: 'Fix "aggregate function calls cannot be nested" (AVG of COUNT) | Seaquel'
description: "Why AVG(COUNT(*)) and MAX(SUM(x)) fail, and how to aggregate an aggregate with a subquery, a CTE or a window function."
lesson: aggregates
error: "aggregate function calls cannot be nested"
broken: |
  SELECT AVG(COUNT(*)) AS avg_products_per_category
  FROM demo.products
  GROUP BY category;
fixed: |
  SELECT AVG(product_count) AS avg_products_per_category
  FROM (
    SELECT category, COUNT(*) AS product_count
    FROM demo.products
    GROUP BY category
  ) per_category;
messages:
  - engine: MySQL
    text: "ERROR 1111 (HY000): Invalid use of group function"
  - engine: SQL Server
    text: "Msg 130: Cannot perform an aggregate function on an expression containing an aggregate or a subquery."
  - engine: DuckDB
    text: "Binder Error: aggregate function calls cannot be nested"
  - engine: SQLite
    text: "misuse of aggregate function COUNT()"
---

You put one aggregate inside another, like `AVG(COUNT(*))`. A single query has one level of grouping, and each aggregate collapses a group into one value. There's no second level for the outer aggregate to work on.

## Why it happens

The question behind the query is reasonable: how many products does a category have on average? Answering it takes two steps. First count products per category, then average those counts.

```sql
SELECT AVG(COUNT(*)) AS avg_products_per_category
FROM demo.products
GROUP BY category;
```

`GROUP BY category` sets up one group per category. `COUNT(*)` runs inside each group. `AVG` would need to run across the groups, over a set of rows that doesn't exist yet in this query. The same goes for `MAX(SUM(quantity))`, `SUM(AVG(price))` and every other nested pair.

## How to fix it

Do the steps one after the other. Put the inner aggregate in a subquery, then aggregate its output:

```sql
SELECT AVG(product_count) AS avg_products_per_category
FROM (
  SELECT category, COUNT(*) AS product_count
  FROM demo.products
  GROUP BY category
) per_category;
```

The subquery returns three rows, 5, 5 and 2, and the outer query averages them to 4.

A [CTE](/learn-sql/cte) says the same thing with the steps in reading order, which helps once there are more than two:

```sql
WITH per_category AS (
  SELECT category, COUNT(*) AS product_count
  FROM demo.products
  GROUP BY category
)
SELECT AVG(product_count) AS avg_products_per_category
FROM per_category;
```

The pattern works for any pair. The most units sold of any single product:

```sql
SELECT MAX(units) AS best_seller_units
FROM (
  SELECT product_id, SUM(quantity) AS units
  FROM demo.order_items
  GROUP BY product_id
) per_product;
```

## Keeping the groups alongside the result

Sometimes you want every category with its own count and the overall average next to it. A window function can wrap an aggregate, because windows are computed after grouping:

```sql
SELECT
  category,
  COUNT(*)                AS product_count,
  AVG(COUNT(*)) OVER ()   AS avg_per_category
FROM demo.products
GROUP BY category;
```

`AVG(...) OVER ()` isn't a nested aggregate. It averages `COUNT(*)` across all the grouped rows. Each category comes back with its count and the average of 4.

## Oracle is the exception

Oracle accepts one level of nesting when the query has a `GROUP BY`, so `SELECT AVG(COUNT(*)) FROM products GROUP BY category` returns a single row there. Queries written that way need the subquery form when you move them to any other database.
