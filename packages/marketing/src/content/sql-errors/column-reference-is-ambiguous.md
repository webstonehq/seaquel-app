---
title: 'column reference "x" is ambiguous'
seoTitle: 'Fix "column reference is ambiguous" (ambiguous column name) in SQL | Seaquel'
description: "Why a join makes an unqualified column like id ambiguous, how table aliases fix it, and what MySQL, SQL Server and SQLite call the same error."
lesson: joins
error: 'column reference "id" is ambiguous'
broken: |
  SELECT id, first_name, status, total_amount
  FROM demo.customers
  JOIN demo.orders ON orders.customer_id = customers.id;
fixed: |
  SELECT o.id, c.first_name, o.status, o.total_amount
  FROM demo.customers c
  JOIN demo.orders o ON o.customer_id = c.id;
messages:
  - engine: MySQL
    text: "ERROR 1052 (23000): Column 'id' in field list is ambiguous"
  - engine: SQL Server
    text: "Msg 209: Ambiguous column name 'id'."
  - engine: SQLite
    text: "ambiguous column name: id"
  - engine: DuckDB
    text: 'Binder Error: Ambiguous reference to column name "id" (use: "customers.id" or "orders.id")'
---

Two tables in the query have a column with the same name, and you used that name without saying which table it comes from. The database won't guess.

## Why it happens

`demo.customers` and `demo.orders` both have an `id` column. Once they're joined, every row carries both, and a bare `id` could mean either one.

```sql
SELECT id, first_name, status, total_amount
FROM demo.customers
JOIN demo.orders ON orders.customer_id = customers.id;
```

`first_name`, `status` and `total_amount` are fine. Each exists in only one of the two tables, so the database can work out where it comes from. Only names that appear in both tables need a table in front of them.

The query can be correct today and break tomorrow. Add a `status` column to `customers` and every unqualified `status` in every query that joins the two tables starts failing.

## How to fix it

Put the table name, or better an alias, in front of the column:

```sql
SELECT o.id, c.first_name, o.status, o.total_amount
FROM demo.customers c
JOIN demo.orders o ON o.customer_id = c.id;
```

Which `id` you pick changes the answer. `o.id` is the order number, `c.id` the customer number. Alice has two orders, so `c.id` would show `1` twice.

Qualify every column once a query touches more than one table, not just the ones the database complains about. It costs a couple of characters and protects the query against future schema changes.

## The same error in WHERE and ORDER BY

`id` is the usual culprit, but in this dataset `created_at` also exists in both tables:

```sql
SELECT c.first_name, o.status
FROM demo.customers c
JOIN demo.orders o ON o.customer_id = c.id
WHERE created_at >= '2024-03-01';   -- column reference "created_at" is ambiguous
```

Use `o.created_at` to filter by order date or `c.created_at` to filter by signup date. They give different answers.

`ORDER BY` has its own wording. Selecting both ids and sorting by a bare `id` gives `ORDER BY "id" is ambiguous`, because the output now has two columns named `id`. Alias them:

```sql
SELECT c.id AS customer_id, o.id AS order_id
FROM demo.customers c
JOIN demo.orders o ON o.customer_id = c.id
ORDER BY order_id;
```

## Joining with USING

When the join columns have the same name in both tables, `JOIN ... USING (col)` merges them into one output column, and you can refer to that column without a table name. It doesn't help here, because the join is `orders.customer_id = customers.id` and the two names differ.
