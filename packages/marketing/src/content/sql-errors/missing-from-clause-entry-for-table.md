---
title: 'missing FROM-clause entry for table "x"'
seoTitle: 'Fix "missing FROM-clause entry for table" in PostgreSQL | Seaquel'
description: "What PostgreSQL means by a missing FROM-clause entry: an alias you never defined, a table you never joined, or a table name used after aliasing it."
lesson: joins
error: 'missing FROM-clause entry for table "o"'
broken: |
  SELECT c.first_name, o.total_amount
  FROM demo.customers c
  JOIN demo.orders ON o.customer_id = c.id;
fixed: |
  SELECT c.first_name, o.total_amount
  FROM demo.customers c
  JOIN demo.orders o ON o.customer_id = c.id;
codes:
  postgresql: '42P01'
messages:
  - engine: SQLite
    text: "no such column: o.total_amount"
  - engine: DuckDB
    text: 'Binder Error: Referenced table "o" not found! Candidate tables: "orders"'
---

The query uses a prefix like `o.` that doesn't match any table or alias in the `FROM` clause. PostgreSQL calls every table or subquery listed in `FROM` or `JOIN` a FROM-clause entry, and the one named in the message isn't there.

## Why it happens

A prefix such as `o.total_amount` has to match something defined in the same query: a table name, or the alias you gave it. Here the alias is used but never defined:

```sql
SELECT c.first_name, o.total_amount
FROM demo.customers c
JOIN demo.orders ON o.customer_id = c.id;
```

`demo.customers` is aliased as `c`, but `demo.orders` has no alias, so its only name is `orders`. Nothing in the query is called `o`.

This mostly happens when editing: you copy a join from another query, rename a table, or add the alias to `SELECT` and forget the `JOIN`.

## How to fix it

Find the name from the error in your `FROM` and `JOIN` clauses. If it isn't there, add it.

**The alias is missing.** Declare it after the table:

```sql
SELECT c.first_name, o.total_amount
FROM demo.customers c
JOIN demo.orders o ON o.customer_id = c.id;
```

**The table was never joined.** Selecting `orders.status` from a query that only reads `demo.customers` fails with `missing FROM-clause entry for table "orders"`. Add the join. Referencing a table in `SELECT` doesn't bring it into the query.

**The table is aliased, but you used its real name.** Once you write `demo.customers c`, the table is called `c` for the rest of the query, and `customers.country` no longer resolves:

```sql
SELECT first_name
FROM demo.customers c
WHERE customers.country = 'US';     -- missing FROM-clause entry for table "customers"
```

Use `c.country`. If the table is also on your `search_path`, PostgreSQL gives a more helpful message for this case: `invalid reference to FROM-clause entry for table "customers"`, with the hint `Perhaps you meant to reference the table alias "c".`

## Aliases don't leak out of subqueries

An alias defined inside a subquery only exists inside it. This fails because `c` belongs to the subquery, and `ORDER BY` runs in the outer query:

```sql
SELECT o.id
FROM demo.orders o
WHERE o.customer_id IN (
  SELECT c.id FROM demo.customers c WHERE c.country = 'US'
)
ORDER BY c.first_name;              -- missing FROM-clause entry for table "c"
```

To sort by a customer column, join `demo.customers` in the outer query instead of filtering through a subquery.
