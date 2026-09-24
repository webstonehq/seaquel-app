---
title: "HAVING vs WHERE"
seoTitle: "SQL HAVING vs WHERE — What's the Difference? | Seaquel"
description: "WHERE filters rows before grouping, HAVING filters groups after. The difference, when each one is correct, and why using the wrong one changes your numbers."
order: 70
demo: "having"
---

Short version: `WHERE` filters rows before they're grouped. `HAVING` filters groups after they're built. Everything else follows from that.

The long version is worth reading, because choosing the wrong one doesn't usually produce an error. It produces a different number.

## Why HAVING exists

Say you want categories with more than three products.

```sql
SELECT category, COUNT(*) AS product_count
FROM demo.products
GROUP BY category
WHERE COUNT(*) > 3;          -- error
```

Two problems. `WHERE` can't come after `GROUP BY`, and more fundamentally `WHERE` runs before the grouping happens, so `COUNT(*)` doesn't exist yet. There is nothing to filter on.

`HAVING` runs after:

```sql
SELECT category, COUNT(*) AS product_count
FROM demo.products
GROUP BY category
HAVING COUNT(*) > 3;
```

Electronics and Accessories, five each. Storage has two and gets dropped.

## The execution order, again

```
FROM      →  get rows
WHERE     →  drop rows
GROUP BY  →  build groups
HAVING    →  drop groups
SELECT    →  compute output columns
ORDER BY  →  sort
LIMIT     →  truncate
```

`WHERE` is third, `HAVING` is fifth. That gap is the whole lesson. `WHERE` can only see individual rows, since groups don't exist when it runs. `HAVING` can see aggregates, because by then they've been computed.

It also explains why `HAVING` can't normally use a `SELECT` alias: `SELECT` runs after it. Repeat the aggregate expression instead.

```sql static
HAVING COUNT(*) > 3        -- works everywhere
HAVING product_count > 3   -- works in MySQL and SQLite, not PostgreSQL
```

## Both in one query

They aren't alternatives. Most real aggregate queries use both.

```sql
SELECT
  customer_id,
  COUNT(*)          AS order_count,
  SUM(total_amount) AS total_spent
FROM demo.orders
WHERE status <> 'pending'
GROUP BY customer_id
HAVING SUM(total_amount) > 100;
```

Read it in execution order. Start with ten orders. `WHERE` removes the three pending ones, leaving seven. Those seven get grouped by customer. Then `HAVING` keeps only customers whose surviving orders total more than 100.

Customer 1 (Alice) has 119.98 and 69.99, so 189.97, and stays. Customer 3 has a single order of 164.97 and stays. Customer 4 has 249.97 and stays. Customer 5 has 139.98 and stays. Customer 2 (Bob) had one completed order of 89.99 and one pending; the pending one was filtered out earlier, so Bob totals 89.99 and gets dropped.

## The mistake that costs you

Swap those two filters and the query still runs. It just answers a different question.

```sql
-- A: exclude pending orders, then find big spenders
SELECT customer_id, SUM(total_amount) AS total
FROM demo.orders
WHERE status <> 'pending'
GROUP BY customer_id
HAVING SUM(total_amount) > 100;

-- B: find big spenders across all orders, then exclude... something
SELECT customer_id, SUM(total_amount) AS total
FROM demo.orders
GROUP BY customer_id
HAVING SUM(total_amount) > 100 AND MAX(status) <> 'pending';
```

Query B has to aggregate `status` to mention it at all, and `MAX(status)` on text is alphabetical nonsense in this context. Query A is what you meant.

The general shape: **conditions on raw column values belong in `WHERE`, conditions on aggregate results belong in `HAVING`.** If you can evaluate the condition by looking at a single row, it's a `WHERE` condition.

There's a performance angle too. `WHERE` shrinks the data before grouping, so the database builds fewer and smaller groups. Filtering in `HAVING` what you could have filtered in `WHERE` means aggregating rows you're about to discard. On this dataset it's unmeasurable. On a billion rows it's the difference between a query and an outage.

## HAVING without GROUP BY

Legal, occasionally useful. With no `GROUP BY` the entire table is one group, so `HAVING` decides whether you get one row or none.

```sql
SELECT COUNT(*) AS order_count
FROM demo.orders
HAVING COUNT(*) > 5;
```

Ten orders, so the condition holds and you get one row. Change it to `> 50` and you get an empty result rather than a row containing 10. Rare in practice, but it shows that `HAVING` really is about groups rather than about `GROUP BY`.

## A worked example

Products that have sold more than two units in total:

```sql
SELECT
  p.name,
  SUM(oi.quantity)               AS units_sold,
  SUM(oi.quantity * oi.unit_price) AS revenue
FROM demo.products p
JOIN demo.order_items oi ON oi.product_id = p.id
JOIN demo.orders o       ON o.id = oi.order_id
WHERE o.status <> 'pending'
GROUP BY p.id, p.name
HAVING SUM(oi.quantity) > 2
ORDER BY units_sold DESC;
```

Every clause is pulling its weight. The joins assemble products with their line items and parent orders. `WHERE` drops line items belonging to pending orders, working on individual rows. `GROUP BY` collapses to one row per product. `HAVING` filters on a total that only exists after grouping. `ORDER BY` sorts the survivors.

Try moving the `WHERE` condition into `HAVING` as `MAX(o.status) <> 'pending'` and watch the numbers change. That's the difference in a form you can see.
