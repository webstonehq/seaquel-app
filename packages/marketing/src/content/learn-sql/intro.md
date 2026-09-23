---
title: "Getting Started"
seoTitle: "SQL Tutorial for Beginners — Start Here | Seaquel"
description: "What SQL actually does, the four tables you'll be querying throughout this course, and your first working query. No setup, no install, no signup."
order: 10
demo: "intro"
---

SQL is how you ask a database questions. You describe what you want back and the database works out how to fetch it. That split matters more than it sounds: in most languages you write the steps, in SQL you write the destination.

Everything in this course runs against the same small dataset, so you can stop worrying about setup and spend your attention on the queries.

## The four tables

```
customers    10 rows    id, email, first_name, last_name, created_at, country
products     12 rows    id, name, category, price, stock_quantity, created_at
orders       10 rows    id, customer_id, status, total_amount, created_at, shipped_at
order_items  17 rows    id, order_id, product_id, quantity, unit_price
```

It's a stripped-down online shop. People buy things. An order belongs to one customer and contains one or more line items, and each line item points at a product.

Small on purpose. Ten customers means you can read the whole table and check by eye whether a query did what you meant. Once queries get complicated, being able to verify the answer manually is the difference between learning SQL and guessing at it.

A few things about this particular data that will come up later:

- Customers 9 and 10 (Iris Taylor and Jack Anderson) have never placed an order.
- Orders have four possible statuses: `pending`, `processing`, `shipped`, `completed`.
- `shipped_at` is `NULL` for anything not yet shipped, which is five of the ten orders.
- Products fall into three categories: Electronics, Accessories and Storage.

## Your first query

```sql
SELECT * FROM demo.customers;
```

Ten rows, six columns. The `demo.` prefix is the schema name, which is a namespace for tables. Plenty of databases put everything in a default schema (`public` in PostgreSQL) and you never type it. Here it's spelled out.

Something slightly more useful:

```sql
SELECT first_name, last_name, country
FROM demo.customers
WHERE country = 'US';
```

Three of the ten are in the US: Alice, Bob and Iris. Note the single quotes around `US`. SQL uses single quotes for text values, and getting that wrong is probably the error you'll hit most often in your first week.

## How to read a query

Take one that does a bit of everything:

```sql
SELECT status, COUNT(*) AS order_count
FROM demo.orders
GROUP BY status
ORDER BY order_count DESC;
```

Four clauses, each with one job. `FROM` names the table. `GROUP BY` buckets rows by status. `SELECT` says what to show for each bucket. `ORDER BY` sorts the output. Run it and you get four rows: `pending` with 3, `completed` with 4, `processing` with 2, `shipped` with 1.

You don't need to understand `GROUP BY` yet. The point is that a SQL query is a stack of clauses in a fixed order, and once you know what each clause does you can read any query by working through it one line at a time.

The fixed order is real, by the way. You can't put `WHERE` after `GROUP BY` or `ORDER BY` before `FROM`. The sequence is always:

```
SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...
```

Most clauses are optional. The order of the ones you do use is not.

## Which SQL?

There is no single SQL. There's a standard that nobody implements completely, and then there's PostgreSQL, MySQL, SQLite, SQL Server, Oracle, DuckDB and a few dozen others, each with its own additions and omissions.

The overlap is large. `SELECT`, `WHERE`, `JOIN`, `GROUP BY` and window functions work essentially the same everywhere, and that's most of what you'll write. The differences show up around the edges: string functions, date arithmetic, how you limit rows, what happens when you divide by zero. Where a query in this course only works on some engines, it says so.

The exercises here run DuckDB compiled to WebAssembly, so the database is genuinely running in your browser tab. Nothing is sent anywhere.

## Getting things wrong

Errors are the main way you'll learn this. `column "foo" does not exist` usually means a typo or a missing table alias. `syntax error at or near ...` means look immediately *before* the thing it's pointing at, since that's typically where the real problem is. A query that returns zero rows isn't broken, it's telling you nothing matched.

The worst case is a query that runs fine and returns the wrong answer. That's most of the way into this course, and it's why the dataset is small enough to check by hand.

Open the exercise below and run the two queries from this page. Then go on to `SELECT`.
