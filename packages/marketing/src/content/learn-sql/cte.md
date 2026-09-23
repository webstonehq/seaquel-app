---
title: "Common Table Expressions"
seoTitle: "SQL CTE Tutorial — WITH Clause Explained | Seaquel"
description: "WITH turns nested subqueries into named steps you read top to bottom. Chaining CTEs, when they help, when they hurt performance, and a short note on recursion."
order: 100
demo: "cte"
---

A CTE is a subquery you've given a name and moved to the top of the statement.

```sql
WITH expensive_products AS (
  SELECT id, name, price
  FROM demo.products
  WHERE price > 50
)
SELECT * FROM expensive_products ORDER BY price DESC;
```

`WITH name AS (query)` defines it, and afterwards you refer to `name` like a table. It exists for the duration of the statement and nothing else can see it.

That example is too small to be worth it. CTEs earn their keep when queries get deep.

## Reading order

Here's a nested version of a real question: which categories have above-average revenue per line item?

```sql
SELECT category, avg_value
FROM (
  SELECT category, AVG(line_value) AS avg_value
  FROM (
    SELECT p.category, oi.quantity * oi.unit_price AS line_value
    FROM demo.order_items oi
    JOIN demo.products p ON p.id = oi.product_id
  ) AS lines
  GROUP BY category
) AS category_averages
WHERE avg_value > (
  SELECT AVG(quantity * unit_price) FROM demo.order_items
);
```

To understand that you start in the middle, work outward, and hold the intermediate shapes in your head. Now the same logic with CTEs:

```sql
WITH lines AS (
  SELECT p.category, oi.quantity * oi.unit_price AS line_value
  FROM demo.order_items oi
  JOIN demo.products p ON p.id = oi.product_id
),
category_averages AS (
  SELECT category, AVG(line_value) AS avg_value
  FROM lines
  GROUP BY category
),
overall AS (
  SELECT AVG(line_value) AS avg_value FROM lines
)
SELECT ca.category, ROUND(ca.avg_value, 2) AS avg_value
FROM category_averages ca
CROSS JOIN overall o
WHERE ca.avg_value > o.avg_value;
```

Longer. Much easier to follow, and each step is independently checkable: comment out the final `SELECT`, replace it with `SELECT * FROM lines`, and see exactly what that stage produces. You can't do that with a nested subquery without surgery.

Notice `lines` gets used twice. A subquery would have to be written out twice or restructured.

## Chaining

CTEs are separated by commas, and each one can reference any CTE defined before it. Only the first gets the `WITH` keyword.

```sql
WITH a AS ( ... ),
     b AS ( SELECT * FROM a ... ),
     c AS ( SELECT * FROM b ... )
SELECT * FROM c;
```

Forward references don't work. `a` can't see `b`.

The statement must end with a real query. A `WITH` block on its own is not a statement, and forgetting the trailing `SELECT` is a common first mistake.

## A worked example

Customers ranked by spend, with their share of the total:

```sql
WITH customer_totals AS (
  SELECT
    o.customer_id,
    COUNT(*)          AS order_count,
    SUM(o.total_amount) AS total_spent
  FROM demo.orders o
  GROUP BY o.customer_id
),
grand_total AS (
  SELECT SUM(total_spent) AS all_spend FROM customer_totals
)
SELECT
  c.first_name || ' ' || c.last_name AS customer,
  ct.order_count,
  ct.total_spent,
  ROUND(100.0 * ct.total_spent / gt.all_spend, 1) AS pct_of_revenue
FROM customer_totals ct
JOIN demo.customers c ON c.id = ct.customer_id
CROSS JOIN grand_total gt
ORDER BY ct.total_spent DESC;
```

David comes top at 249.97 of the 1,289.81 total, a little over 19%. Grace follows on 199.98, then Alice on 189.97 across two orders.

`CROSS JOIN` against a single-row CTE is the normal way to make one scalar available to every row. No join condition, so every row pairs with the one row.

Watch the `100.0` rather than `100`. In PostgreSQL, integer division truncates, so `100 * 2 / 10` is fine but a percentage calculation on integer columns silently floors to 0. Forcing one side to a decimal avoids it. DuckDB and SQLite are more forgiving here; Postgres is not.

## Performance

For a long time, PostgreSQL treated every CTE as an optimisation fence: it materialised the result, then ran the outer query against that, even when pushing a filter inward would have been faster. Version 12 changed the default so CTEs referenced once are inlined, with `MATERIALIZED` and `NOT MATERIALIZED` available to force either behaviour.

Other engines vary. MySQL 8 inlines by default, and SQLite decides case by case.

Practically: on ordinary queries write CTEs freely and prefer clarity. If a CTE-based query is unexpectedly slow, try the inlined version before assuming the logic is at fault. And a CTE referenced many times may be worth materialising deliberately so the work happens once.

## Recursive CTEs

`WITH RECURSIVE` lets a CTE refer to itself, which is how you walk hierarchies: org charts, category trees, threaded comments, graph paths.

```sql
WITH RECURSIVE counter AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM counter WHERE n < 5
)
SELECT n FROM counter;
```

Rows 1 through 5. The first branch is the anchor, the second feeds on what the previous round produced, and the `WHERE` stops it. Drop that condition and the query runs until something kills it.

The practice database is flat, so there's nothing here to recurse over. Worth knowing the feature exists: the day you meet a `parent_id` column pointing at the same table, this is the tool.
