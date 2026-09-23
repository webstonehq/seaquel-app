---
title: "SQL Joins"
seoTitle: "SQL Joins Explained — INNER, LEFT, RIGHT & FULL | Seaquel"
description: "INNER, LEFT, RIGHT and FULL joins with working examples, plus the two mistakes that quietly corrupt results: filtering a LEFT JOIN in WHERE, and row fan-out."
order: 80
demo: "joins"
---

Relational databases split data across tables deliberately. Customers go in one table, their orders in another. Joining is how you put them back together for a query.

Four tables here. `customers` holds people. `orders` holds purchases, each with a `customer_id` pointing back at a customer. `products` holds items. `order_items` sits between orders and products, carrying a quantity and the price paid. Two entity tables with a junction table between them is the most common shape you'll meet in real schemas.

## INNER JOIN

```sql
SELECT
  c.first_name,
  c.last_name,
  o.id           AS order_id,
  o.total_amount
FROM demo.customers c
INNER JOIN demo.orders o ON o.customer_id = c.id;
```

Read `ON o.customer_id = c.id` as the rule for pairing rows. Wherever it holds, you get one output row combining both sides. Ten rows here, one per order.

`INNER` is the default, so plain `JOIN` means the same thing. Writing it out signals that you chose an inner join rather than forgot to consider the alternative.

The defining behaviour: a customer with no orders doesn't appear at all. Iris and Jack are absent from that result entirely. Inner joins drop unmatched rows on both sides, which is usually what you want and occasionally a bug you won't notice for a week.

Those single-letter aliases aren't decoration. Both tables have an `id` column, so a bare `id` is ambiguous and the database will say so. Aliasing every table and qualifying every column is the habit that keeps multi-table queries readable.

## LEFT JOIN

```sql
SELECT
  c.first_name,
  c.last_name,
  o.id AS order_id
FROM demo.customers c
LEFT JOIN demo.orders o ON o.customer_id = c.id;
```

Twelve rows now. Every customer appears whether or not they matched, and where there was no match the order columns come back null. Iris and Jack each get one row with a null `order_id`.

That gives you a way to answer "which customers have never ordered?", a question an inner join structurally cannot answer:

```sql
SELECT c.first_name, c.last_name
FROM demo.customers c
LEFT JOIN demo.orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
```

Iris Taylor and Jack Anderson. Join everything, then keep only the rows where the right side came back empty. It's called an anti-join and it's worth being able to spot.

`RIGHT JOIN` mirrors it, keeping everything from the right table. You'll see it rarely, because swapping the table order and writing `LEFT` is easier to reason about. `FULL OUTER JOIN` keeps unmatched rows from both sides at once; PostgreSQL and DuckDB have it, MySQL doesn't.

## Filtering a LEFT JOIN in WHERE

The most common join bug, and it doesn't announce itself.

```sql
-- Intended: all customers, with their completed orders where they exist
SELECT c.first_name, o.id
FROM demo.customers c
LEFT JOIN demo.orders o ON o.customer_id = c.id
WHERE o.status = 'completed';
```

The join runs first and fills unmatched rows with null. Then `WHERE` runs, and `null = 'completed'` is unknown rather than true, so every customer without a completed order is discarded. You wrote `LEFT JOIN` and got inner join behaviour: four rows covering three customers, where you expected all ten people to appear.

Move the condition into `ON`, where it applies while matching instead of afterwards:

```sql
SELECT c.first_name, o.id
FROM demo.customers c
LEFT JOIN demo.orders o
  ON o.customer_id = c.id
 AND o.status = 'completed';
```

Eleven rows: Alice twice for her two completed orders, Bob and Carol once each, and the remaining seven customers with nulls.

Conditions on the left table go in `WHERE`. Conditions on the right table of a `LEFT JOIN` go in `ON`. For an inner join the distinction makes no difference at all, which is exactly why people pick up the wrong habit and only discover it later.

## Row fan-out

Joining through a junction table multiplies rows, and that quietly breaks anything you aggregate on top.

```sql
SELECT o.id, o.total_amount, oi.quantity
FROM demo.orders o
JOIN demo.order_items oi ON oi.order_id = o.id;
```

Seventeen rows from ten orders. Order 3 has three line items, so it occupies three rows and `total_amount` of 164.97 is repeated in all three.

Sum that column now and the number is meaningless:

```sql
-- Wrong: counts total_amount once per line item
SELECT SUM(o.total_amount)
FROM demo.orders o
JOIN demo.order_items oi ON oi.order_id = o.id;
```

You get 2,444.64 rather than the real 1,289.81.

This is the moment people reach for `SELECT DISTINCT`, which sometimes makes the figure look plausible and never actually fixes it. Aggregate at the right grain instead. Either work from the line items directly:

```sql
SELECT SUM(oi.quantity * oi.unit_price) AS revenue
FROM demo.order_items oi;
```

or collapse the child table before joining, so each order contributes one row:

```sql
SELECT
  o.id,
  o.total_amount,
  items.line_count
FROM demo.orders o
LEFT JOIN (
  SELECT order_id, COUNT(*) AS line_count
  FROM demo.order_items
  GROUP BY order_id
) items ON items.order_id = o.id;
```

Any time a join makes a total look too big, count the rows before and after. Fan-out is nearly always the explanation.

## Chaining joins

Each join narrows or widens what you've assembled so far:

```sql
SELECT
  c.first_name || ' ' || c.last_name AS customer,
  p.name      AS product,
  oi.quantity,
  oi.unit_price
FROM demo.customers c
JOIN demo.orders      o  ON o.customer_id = c.id
JOIN demo.order_items oi ON oi.order_id   = o.id
JOIN demo.products    p  ON p.id          = oi.product_id
ORDER BY customer, product;
```

Top to bottom: start with customers, attach their orders, attach each order's line items, attach the product each line refers to. Seventeen rows out, one per line item, with every table's columns available to `SELECT`.

One thing to watch. A single `LEFT JOIN` partway down a chain makes everything after it conditional too. If `orders` is left-joined, `order_items` can only match where an order existed, so that join needs to be `LEFT` as well or the whole chain collapses back to inner join behaviour.

Joins are where SQL stops being a way to read a table and starts being a way to ask questions about a schema. If one query in this course is worth running line by line and checking against the raw data, it's the four-table one above.
