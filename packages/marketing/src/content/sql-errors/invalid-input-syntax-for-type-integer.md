---
title: 'invalid input syntax for type integer: "x"'
seoTitle: 'Fix "invalid input syntax for type integer" in PostgreSQL | Seaquel'
description: "Why PostgreSQL rejects a string compared with or cast to an integer column, including the empty-string case, and how to fix the query or clean the input."
lesson: where
error: 'invalid input syntax for type integer: "alice@example.com"'
broken: |
  SELECT id, status, total_amount
  FROM demo.orders
  WHERE customer_id = 'alice@example.com';
fixed: |
  SELECT o.id, o.status, o.total_amount
  FROM demo.orders o
  JOIN demo.customers c ON c.id = o.customer_id
  WHERE c.email = 'alice@example.com';
messages:
  - engine: SQL Server
    text: "Msg 245: Conversion failed when converting the varchar value 'alice@example.com' to data type int."
  - engine: DuckDB
    text: "Conversion Error: Could not convert string 'alice@example.com' to INT32"
  - engine: SQLite
    note: "No error. The comparison is simply false, so no rows come back."
---

PostgreSQL tried to turn a piece of text into an integer and the text isn't a number. The quoted value in the message is the exact string it choked on, which usually tells you where it came from.

## Why it happens

`customer_id` is an integer column. Comparing it with a quoted literal makes PostgreSQL read the literal as an integer, and `alice@example.com` doesn't parse as one:

```sql
SELECT id, status, total_amount
FROM demo.orders
WHERE customer_id = 'alice@example.com';
```

Quotes alone aren't the problem. `WHERE customer_id = '1'` runs fine, because `'1'` parses as an integer. The problem is a value that can't.

In practice this is usually one of two things: the query compares the wrong column (an email against an id, as here), or a value from user input, a form or a CSV isn't the number the code assumed it was.

## How to fix it

**Compare against the right column.** The orders table only knows the customer's id. To find orders by email, join to the table that has the email:

```sql
SELECT o.id, o.status, o.total_amount
FROM demo.orders o
JOIN demo.customers c ON c.id = o.customer_id
WHERE c.email = 'alice@example.com';
```

Alice has two orders, 1 and 4.

**Validate input before it reaches the query.** If the value comes from an application, check that it's a number there and pass it as a query parameter. That gives the user a useful message instead of a database error.

## The empty-string version

The most common form of this error in real code has nothing inside the quotes:

```
ERROR:  invalid input syntax for type integer: ""
```

An empty form field or a blank CSV cell arrived as `''`, and PostgreSQL doesn't treat an empty string as zero or as `NULL`. If blank should mean "no value", turn it into `NULL` before casting:

```sql
SELECT NULLIF('', '')::integer;    -- NULL
```

`NULLIF(x, '')` returns `NULL` when `x` is empty and `x` otherwise, so `NULLIF(input, '')::integer` handles both. When loading messy text columns, you can go further and only cast values that look like whole numbers:

```sql
SELECT v, CASE WHEN v ~ '^[0-9]+$' THEN v::integer END AS n
FROM (VALUES ('42'), (''), ('n/a')) t(v);
```

`42` becomes 42; the blank and `n/a` become `NULL`.

The same error appears for other types with their own names in the message, such as `numeric`, `bigint`, `uuid` or `date`. The fix is the same: find the value it quotes, then work out why it isn't the type the column expects.
