---
title: "Subqueries"
seoTitle: "SQL Subqueries — IN, EXISTS and Correlated Queries | Seaquel"
description: "Queries inside queries: scalar subqueries, IN and EXISTS, correlated subqueries, and the NOT IN behaviour with NULLs that returns zero rows for no obvious reason."
order: 90
demo: "subqueries"
---

A subquery is a `SELECT` wrapped in parentheses inside another statement. The database runs the inner one and hands the result to the outer one.

They show up in three places: the `WHERE` clause, the select list, and the `FROM` clause. Each behaves slightly differently.

## In WHERE, comparing to one value

The most common case. Find products priced above average:

```sql
SELECT name, price
FROM demo.products
WHERE price > (SELECT AVG(price) FROM demo.products);
```

The inner query returns 55.24. The outer query then behaves as though you'd typed that number. Five products clear it: the Mechanical Keyboard, Webcam HD, Headphones, Laptop Stand and External SSD.

This works because the subquery returns exactly one row with one column, a *scalar* subquery. Return two rows into a `>` comparison and you get an error, since the database has no idea which one you meant.

You couldn't write this with `WHERE price > AVG(price)`. Aggregates aren't allowed in `WHERE`, and even if they were, `AVG(price)` there would refer to the rows being filtered rather than the whole table. The subquery gives you a separate pass over the data.

## IN, with a list of values

When the inner query returns a column of values, `IN` checks membership:

```sql
SELECT first_name, last_name
FROM demo.customers
WHERE id IN (
  SELECT customer_id
  FROM demo.orders
  WHERE status = 'completed'
);
```

Customers with at least one completed order: Alice, Bob and Carol.

`NOT IN` inverts it, and this is where it goes wrong.

## The NOT IN trap

```sql
SELECT id, status
FROM demo.orders
WHERE id NOT IN (
  SELECT order_id FROM demo.order_items
);
```

Every order in this dataset has line items, so you'd expect zero rows and you get zero rows. Fine.

Now imagine one `order_items` row had a null `order_id`. The query would *still* return zero rows, even for orders that genuinely have no items. Nulls turn `NOT IN` into a black hole.

The reason: `x NOT IN (1, 2, NULL)` expands to `x <> 1 AND x <> 2 AND x <> NULL`. That last comparison is unknown, never false, so the whole chain can never be true. `WHERE` keeps only true, so nothing survives.

`IN` doesn't have this problem, because one true is enough to make the `OR` chain true.

Three ways out. Filter the nulls yourself with `WHERE order_id IS NOT NULL` inside the subquery. Use `NOT EXISTS`, which doesn't care. Or use a `LEFT JOIN` with an `IS NULL` check. Any time a `NOT IN` returns a suspiciously empty result, this is the first thing to check.

## EXISTS

`EXISTS` asks whether the subquery produces any rows at all. It doesn't matter what's in them, which is why people conventionally write `SELECT 1`.

```sql
SELECT c.first_name, c.last_name
FROM demo.customers c
WHERE EXISTS (
  SELECT 1
  FROM demo.orders o
  WHERE o.customer_id = c.id
);
```

Eight customers. Iris and Jack are missing because they've never ordered.

Note `o.customer_id = c.id`: the inner query refers to `c`, a table from the outer query. That makes it a **correlated** subquery, evaluated once per outer row rather than once for the whole statement.

`NOT EXISTS` finds the other two:

```sql
SELECT c.first_name, c.last_name
FROM demo.customers c
WHERE NOT EXISTS (
  SELECT 1 FROM demo.orders o WHERE o.customer_id = c.id
);
```

Iris Taylor and Jack Anderson. This is the null-safe version of `NOT IN`, and it's what you should reach for by default.

## Correlated subqueries in the select list

A scalar subquery can sit in `SELECT`, producing one value per output row:

```sql
SELECT
  c.first_name,
  c.last_name,
  (SELECT COUNT(*) FROM demo.orders o WHERE o.customer_id = c.id) AS order_count
FROM demo.customers c
ORDER BY order_count DESC;
```

Alice and Bob show 2, the other six show 1, Iris and Jack show 0.

Compare that to the `LEFT JOIN` plus `GROUP BY` version from the grouping lesson. Same answer, different shape. The subquery version reads more directly and gives you 0 rather than null for the customers with no orders, which is a small mercy. The join version scales better when you want several aggregates at once, since the subquery approach needs a separate pass per column.

On small data it makes no difference. On large tables, a correlated subquery in the select list runs once per row, and query planners are only sometimes clever enough to rewrite it.

## Subqueries in FROM

A subquery in `FROM` behaves like a temporary table. It needs an alias.

```sql
SELECT
  category,
  ROUND(AVG(order_value), 2) AS avg_line_value
FROM (
  SELECT
    p.category,
    oi.quantity * oi.unit_price AS order_value
  FROM demo.order_items oi
  JOIN demo.products p ON p.id = oi.product_id
) AS line_values
GROUP BY category;
```

The inner query flattens line items into a category and a value. The outer one aggregates. Doing it in one pass isn't possible, because you can't aggregate an aggregate directly.

This is also the standard fix for "I can't filter on my alias". Compute it inside, filter outside:

```sql
SELECT * FROM (
  SELECT name, price * 0.9 AS sale_price
  FROM demo.products
) AS discounted
WHERE sale_price < 30;
```

Nesting these more than two deep gets unreadable fast, because you have to read inside out. That's the problem CTEs solve, and they're next.

## One more pattern worth stealing

Reconciling a stored total against the underlying detail:

```sql
SELECT
  o.id,
  o.total_amount                             AS recorded,
  SUM(oi.quantity * oi.unit_price)           AS calculated,
  o.total_amount - SUM(oi.quantity * oi.unit_price) AS difference
FROM demo.orders o
JOIN demo.order_items oi ON oi.order_id = o.id
GROUP BY o.id, o.total_amount
HAVING o.total_amount <> SUM(oi.quantity * oi.unit_price);
```

Run it against this dataset and three orders come back: 1, 3 and 5. Their recorded totals don't match the sum of their line items.

That isn't a trick question. The sample data really is inconsistent, and this query is how you'd find out. Reconciliation queries like this are among the most useful things you'll write, because a denormalised total that drifts from its source is one of the most common data bugs in production systems.
