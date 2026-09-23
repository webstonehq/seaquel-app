---
title: "Aggregate Functions"
seoTitle: "SQL Aggregate Functions — COUNT, SUM, AVG, MIN, MAX | Seaquel"
description: "COUNT, SUM, AVG, MIN and MAX, the difference between COUNT(*) and COUNT(column), and how aggregates quietly skip NULLs in a way that can skew an average."
order: 50
demo: "aggregates"
---

Everything so far returned one output row per input row. Aggregates collapse many rows into one number.

```sql
SELECT COUNT(*) FROM demo.orders;
```

One row, one column, the value 10.

## The five you'll use

```sql
SELECT
  COUNT(*)          AS product_count,
  SUM(price)        AS total_price,
  AVG(price)        AS average_price,
  MIN(price)        AS cheapest,
  MAX(price)        AS dearest
FROM demo.products;
```

Twelve products, prices summing to 662.88, averaging 55.24, ranging from 12.99 to 149.99.

`MIN` and `MAX` work on text and dates as well as numbers. `MIN(last_name)` gives you Anderson, `MAX(created_at)` on orders gives the most recent order date.

## COUNT(\*) versus COUNT(column)

These are not the same function wearing different hats, and the difference matters.

```sql
SELECT
  COUNT(*)          AS all_rows,      -- 10
  COUNT(shipped_at) AS shipped_rows   -- 5
FROM demo.orders;
```

`COUNT(*)` counts rows. `COUNT(column)` counts rows where that column is not null. Five orders have no `shipped_at`, so the second number is half the first.

That's occasionally exactly what you want. `COUNT(shipped_at)` is a perfectly good way to ask "how many orders have shipped". It's a bug when you meant to count rows and happened to pick a nullable column to count.

`COUNT(DISTINCT column)` counts unique non-null values:

```sql
SELECT
  COUNT(*)                   AS order_count,     -- 10
  COUNT(DISTINCT customer_id) AS customer_count  -- 8
FROM demo.orders;
```

Ten orders placed by eight distinct customers, because Alice and Bob each ordered twice.

## NULLs get skipped

Every aggregate except `COUNT(*)` ignores nulls entirely. Not "treats them as zero" — removes them from the calculation before it runs.

For `SUM` that's usually harmless, since adding zero changes nothing. For `AVG` it changes the answer, because the denominator shrinks too. If `orders.total_amount` had three nulls, `AVG(total_amount)` would divide by 7, not 10. Whether that's right depends entirely on whether a missing amount means "unknown" or "zero", and the database can't know which you meant.

When you want nulls counted as zero, say so:

```sql
SELECT AVG(COALESCE(total_amount, 0)) FROM demo.orders;
```

`COALESCE` returns its first non-null argument. It's the standard way to put a floor under a nullable column, and you'll use it constantly once `LEFT JOIN` starts producing nulls.

An aggregate over zero rows returns null rather than zero, which surprises people:

```sql
SELECT SUM(total_amount) FROM demo.orders WHERE status = 'refunded';
```

No order has that status, so this is null, not 0. `COALESCE(SUM(total_amount), 0)` if you need a number.

## Aggregates with a filter

`WHERE` runs before aggregation, so filtering narrows what gets aggregated:

```sql
SELECT
  COUNT(*)           AS completed_orders,
  SUM(total_amount)  AS completed_revenue
FROM demo.orders
WHERE status = 'completed';
```

Four orders, 444.93 between them.

You can also aggregate different subsets in one pass, using `CASE` inside the aggregate. This is worth learning early because it saves you writing three separate queries:

```sql
SELECT
  COUNT(*) AS total,
  COUNT(CASE WHEN status = 'pending' THEN 1 END)   AS pending,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed,
  SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) AS completed_revenue
FROM demo.orders;
```

The trick is that a `CASE` with no `ELSE` returns null when nothing matches, and `COUNT` skips nulls. So each `COUNT(CASE ...)` counts only the rows that matched. PostgreSQL also supports `COUNT(*) FILTER (WHERE status = 'pending')`, which does the same thing and reads better.

## Mixing aggregates with plain columns

This looks reasonable and is an error:

```sql
SELECT name, MAX(price) FROM demo.products;   -- error
```

`MAX(price)` collapses twelve rows to one. `name` has twelve different values and no way to pick between them. Most databases reject it outright; MySQL historically returned an arbitrary name, which is worse, because the query appears to work.

To get the name of the most expensive product, sort and take one:

```sql
SELECT name, price
FROM demo.products
ORDER BY price DESC
LIMIT 1;
```

The rule that makes this make sense: every column in your select list has to be either aggregated or grouped. That's the whole point of `GROUP BY`, which is next.
