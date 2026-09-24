---
title: "Window Functions"
seoTitle: "SQL Window Functions — ROW_NUMBER, RANK, LAG, Running Totals | Seaquel"
description: "OVER, PARTITION BY and ORDER BY, the difference between ROW_NUMBER, RANK and DENSE_RANK, running totals, LAG and LEAD, and how to filter on a window result."
order: 110
demo: "window"
---

`GROUP BY` collapses rows. Window functions don't. They compute across a set of related rows and hand the answer back to every one of them, leaving your row count untouched.

That's the whole idea. Everything else is syntax.

```sql
SELECT
  name,
  category,
  price,
  AVG(price) OVER (PARTITION BY category) AS category_avg
FROM demo.products;
```

Twelve rows in, twelve rows out, each carrying its own category's average alongside its own price. `GROUP BY category` would have given you three rows and thrown the product names away.

## The OVER clause

`OVER` is what makes a function a window function. Inside it, two optional parts:

```sql static
OVER (PARTITION BY category ORDER BY price)
```

`PARTITION BY` splits rows into groups, much like `GROUP BY`, except the rows survive. Omit it and the whole result set is one partition.

`ORDER BY` sequences rows inside each partition. Ranking functions need it. For aggregates it changes the meaning in a way that catches people out, which is the running-total section below.

## Ranking

Three functions, three different answers to ties.

```sql
SELECT
  name,
  category,
  price,
  ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS row_num,
  RANK()       OVER (PARTITION BY category ORDER BY price DESC) AS rank,
  DENSE_RANK() OVER (PARTITION BY category ORDER BY price DESC) AS dense_rank
FROM demo.products
ORDER BY category, price DESC;
```

`ROW_NUMBER` always gives 1, 2, 3, 4 with no repeats. Ties are broken arbitrarily, so add enough to `ORDER BY` to make it deterministic if you care which row wins.

`RANK` gives equal values the same rank and then skips: 1, 2, 2, 4. `DENSE_RANK` doesn't skip: 1, 2, 2, 3.

No two products share a price in this dataset, so all three columns agree. Real data ties constantly, and picking the wrong one produces a leaderboard that's subtly wrong.

## Top N per group

This is the thing window functions are for, and it's genuinely awkward without them. The most expensive product in each category:

```sql
WITH ranked AS (
  SELECT
    name,
    category,
    price,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) AS rn
  FROM demo.products
)
SELECT name, category, price
FROM ranked
WHERE rn = 1;
```

Headphones for Electronics at 149.99, Laptop Stand for Accessories at 59.99, External SSD for Storage at 99.99.

The CTE is not optional, and this is the rule that trips everyone: **you cannot filter on a window function in `WHERE`.** Window functions are computed after `WHERE` and after `GROUP BY`, so `WHERE rn = 1` fails with "column rn does not exist". Compute in one step, filter in the next.

Postgres has no shortcut for this, so the CTE is the way you write it. Some other engines have `QUALIFY`, which does the filtering in place:

```sql static
SELECT name, category, price
FROM demo.products
QUALIFY ROW_NUMBER() OVER (PARTITION BY category ORDER BY price DESC) = 1;
```

That's Snowflake and BigQuery, among others. It won't run here, and the CTE version works everywhere anyway.

## Running totals

Add `ORDER BY` inside `OVER` on an aggregate and its meaning changes: instead of the whole partition, it covers everything from the start of the partition up to the current row.

```sql
SELECT
  id,
  created_at,
  total_amount,
  SUM(total_amount) OVER (ORDER BY created_at) AS running_total
FROM demo.orders
ORDER BY created_at;
```

Order 1 shows 119.98, order 2 shows 209.97, and it climbs to 1,289.81 by the last row.

Take the `ORDER BY` out of `OVER` and every row shows 1,289.81 instead, because the window becomes the entire partition. Same function, same column, completely different result, no error either way. When a running total comes back looking like a grand total repeated, this is why.

Per-customer running totals just need a partition:

```sql
SELECT
  customer_id,
  created_at,
  total_amount,
  SUM(total_amount) OVER (
    PARTITION BY customer_id ORDER BY created_at
  ) AS customer_running_total
FROM demo.orders
ORDER BY customer_id, created_at;
```

## LAG and LEAD

These reach into the previous or next row of the partition, which is how you compute change over time without joining a table to itself.

```sql
SELECT
  id,
  created_at,
  total_amount,
  LAG(total_amount) OVER (ORDER BY created_at)  AS previous_amount,
  total_amount - LAG(total_amount) OVER (ORDER BY created_at) AS change
FROM demo.orders
ORDER BY created_at;
```

The first row has no predecessor, so `previous_amount` is null and so is `change`. `LAG(total_amount, 1, 0)` supplies a default instead: second argument is how many rows back, third is the fallback.

`LEAD` is the same in the other direction. A common use is measuring the gap between consecutive events per customer:

```sql
SELECT
  customer_id,
  created_at,
  LEAD(created_at) OVER (PARTITION BY customer_id ORDER BY created_at) AS next_order_at
FROM demo.orders
ORDER BY customer_id, created_at;
```

Only Alice and Bob have a second order, so everyone else gets null.

## Frames

The full syntax has a third part after `ORDER BY`:

```sql static
SUM(total_amount) OVER (
  ORDER BY created_at
  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
)
```

That's a three-row moving sum. The frame clause defines which rows around the current one are in scope, and it's how moving averages get written.

Two defaults are worth knowing because they're invisible and they differ. With `ORDER BY` and no frame, the default is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Without `ORDER BY`, it's the entire partition.

The `RANGE` default has a sharp edge: it includes *all* rows tied on the ordering value, not just the current one. Ordering by a date column where several rows share a date means those rows all see the same running total. `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` gives strict row-by-row behaviour. For running totals over a non-unique column, `ROWS` is almost always what you meant.

## Where this leaves you

Window functions are the point where SQL stops being a way to fetch rows and starts being a way to compute. Ranking within groups, period-over-period comparisons, moving averages, deduplication by keeping `ROW_NUMBER() = 1`, sessionisation — all of it is this one construct with different functions plugged in.

If you've followed the course to here, you can read most production SQL you'll encounter. What's left is dialect trivia and practice.
