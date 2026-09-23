---
title: "more than one row returned by a subquery used as an expression"
seoTitle: 'Fix "more than one row returned by a subquery" / "Subquery returns more than 1 row" | Seaquel'
description: "Why a subquery after = or inside SELECT must return a single row, why the query worked yesterday, and how to fix it with IN, an aggregate or LIMIT 1."
lesson: subqueries
error: "more than one row returned by a subquery used as an expression"
broken: |
  SELECT name, price
  FROM demo.products
  WHERE id = (SELECT product_id FROM demo.order_items WHERE order_id = 3);
fixed: |
  SELECT name, price
  FROM demo.products
  WHERE id IN (SELECT product_id FROM demo.order_items WHERE order_id = 3);
messages:
  - engine: MySQL
    text: "ERROR 1242 (21000): Subquery returns more than 1 row"
  - engine: SQL Server
    text: "Msg 512: Subquery returned more than 1 value. This is not permitted when the subquery follows =, !=, <, <= , >, >= or when the subquery is used as an expression."
  - engine: DuckDB
    text: "Invalid Input Error: More than one row returned by a subquery used as an expression - scalar subqueries can only return a single row."
  - engine: SQLite
    note: "No error. Uses the first row the subquery returns and ignores the rest."
---

A subquery used as a single value returned several rows. `=` compares against one value, so the database stops rather than guess which row you meant.

## Why it happens

A subquery in parentheses after `=`, `<`, `>` or in the `SELECT` list is a scalar subquery: it has to produce at most one row with one column. The database only finds out how many rows it produces when it runs.

```sql
SELECT name, price
FROM demo.products
WHERE id = (SELECT product_id FROM demo.order_items WHERE order_id = 3);
```

Order 3 has three line items, so the subquery returns three product ids. Change the `3` to `2` and the same query runs fine, because order 2 has a single line item.

That's why this error often shows up in code that has worked for months. The query was always wrong. The data just hadn't exposed it yet: the first customer with two orders, the first product in two categories.

The same thing happens with a correlated subquery in `SELECT`:

```sql
SELECT
  c.first_name,
  (SELECT o.total_amount FROM demo.orders o WHERE o.customer_id = c.id) AS order_total
FROM demo.customers c;
```

Alice and Bob have two orders each, so this fails on their rows.

## How to fix it

Decide whether you want all the rows or one of them.

**You want all of them.** Use `IN` instead of `=`. It accepts any number of rows, including none:

```sql
SELECT name, price
FROM demo.products
WHERE id IN (SELECT product_id FROM demo.order_items WHERE order_id = 3);
```

PostgreSQL also accepts `= ANY (subquery)`, which means the same thing. For large subqueries, `EXISTS` or a join is often clearer.

**You want one number that summarises them.** Aggregate inside the subquery, so it can only ever return one row:

```sql
SELECT
  c.first_name,
  (SELECT SUM(o.total_amount) FROM demo.orders o WHERE o.customer_id = c.id) AS lifetime_value
FROM demo.customers c
ORDER BY c.id;
```

**You want one specific row**, such as the latest order. Say which one with `ORDER BY` and `LIMIT 1`:

```sql
SELECT
  c.first_name,
  (SELECT o.total_amount
   FROM demo.orders o
   WHERE o.customer_id = c.id
   ORDER BY o.created_at DESC
   LIMIT 1) AS latest_order_total
FROM demo.customers c
ORDER BY c.id;
```

Don't add `LIMIT 1` without the `ORDER BY`. The error goes away, but you get whichever row the database reads first, which can change between runs.

## Engines that don't complain

SQLite never raises this error. It takes the first row the subquery returns and discards the rest, so the broken query above returns one product and looks like it worked.

DuckDB used to behave the same way and now raises the error by default. `SET scalar_subquery_error_on_multiple_rows = false` restores the old behaviour, which has the same problem as SQLite's.
