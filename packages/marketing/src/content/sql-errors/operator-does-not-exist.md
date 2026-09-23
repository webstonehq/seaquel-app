---
title: 'operator does not exist: character varying = integer'
seoTitle: 'Fix "operator does not exist: character varying = integer" in PostgreSQL | Seaquel'
description: "PostgreSQL won't compare text to a number without a cast. Usually the join or filter is on the wrong column. Sometimes a cast is the right fix."
lesson: joins
error: 'operator does not exist: character varying = integer'
broken: |
  SELECT o.id, c.first_name
  FROM demo.orders o
  JOIN demo.customers c ON c.email = o.customer_id;
fixed: |
  SELECT o.id, c.first_name
  FROM demo.orders o
  JOIN demo.customers c ON c.id = o.customer_id;
messages:
  - engine: SQL Server
    text: "Msg 245: Conversion failed when converting the varchar value 'alice@example.com' to data type int."
  - engine: DuckDB
    text: "Conversion Error: Could not convert string 'alice@example.com' to INT32 when casting from source column email"
  - engine: MySQL
    note: "No error. Both sides are compared as numbers, every email converts to 0, and nothing matches."
  - engine: SQLite
    note: "No error. Text never equals an integer, so the join returns no rows."
---

You compared a text column to an integer column. PostgreSQL has no `=` operator for that pair of types and won't convert one to the other for you. The full message comes with a hint:

```
ERROR:  operator does not exist: character varying = integer
HINT:  No operator matches the given name and argument types. You might need to add explicit type casts.
```

The hint suggests a cast. Usually the real fix is to compare the right columns.

## Why it happens

`c.email` is `VARCHAR(255)` and `o.customer_id` is `INTEGER`:

```sql
SELECT o.id, c.first_name
FROM demo.orders o
JOIN demo.customers c ON c.email = o.customer_id;
```

PostgreSQL looks for an `=` that takes `character varying` on the left and `integer` on the right, and there isn't one. The two types in the message are listed in the order they appear in the comparison, so `character varying = integer` means the text column is on the left.

Most other engines try to convert one side and carry on. PostgreSQL refuses, because the conversion is almost always hiding a mistake. An email can never equal a customer id, so the join could never match anything.

## How to fix it

**You're comparing the wrong column.** This is the common case, especially in joins. `orders.customer_id` points at `customers.id`, not at `email`:

```sql
SELECT o.id, c.first_name
FROM demo.orders o
JOIN demo.customers c ON c.id = o.customer_id;
```

When the error names a join condition, check the foreign key. The types on both sides of a correct join almost always match.

**The types really differ, and the values are comparable.** For example, an id stored as text in one table and as an integer in another. Cast one side explicitly:

```sql
SELECT id
FROM demo.customers
WHERE id::text = '1';
```

Cast the side whose conversion can't fail. Every integer converts to text, but `c.email::integer` fails with [invalid input syntax for type integer](/sql-errors/invalid-input-syntax-for-type-integer) as soon as it reaches `'alice@example.com'`. Casting a column also stops PostgreSQL from using an index on it, so if you do this often, fix the column type instead.

## Why a quoted number works but a typed one doesn't

This runs fine, even though `'1'` looks like text:

```sql
SELECT id FROM demo.orders WHERE customer_id = '1';
```

A quoted literal has no type until PostgreSQL decides what it should be, and next to an integer column it becomes an integer. A value that already has a type is different: `customer_id = 1::text`, or a parameter your driver sends as text, gives `operator does not exist: integer = text`. If the error appears only when the query runs from application code, check what type the driver sends for the parameter.
