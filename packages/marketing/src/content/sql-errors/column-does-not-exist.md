---
title: 'column "x" does not exist'
seoTitle: 'Fix "column does not exist" in PostgreSQL: aliases, quotes and case | Seaquel'
description: "Why PostgreSQL can't find a column that's right there in your SELECT: aliases used in WHERE, double-quoted strings, and case-sensitive quoted identifiers."
lesson: where
error: 'column "stock_value" does not exist'
broken: |
  SELECT name, price * stock_quantity AS stock_value
  FROM demo.products
  WHERE stock_value > 5000;
fixed: |
  SELECT name, price * stock_quantity AS stock_value
  FROM demo.products
  WHERE price * stock_quantity > 5000;
messages:
  - engine: MySQL
    text: "ERROR 1054 (42S22): Unknown column 'stock_value' in 'where clause'"
  - engine: SQL Server
    text: "Msg 207: Invalid column name 'stock_value'."
  - engine: Oracle
    text: 'ORA-00904: "STOCK_VALUE": invalid identifier'
  - engine: DuckDB
    note: "No error. DuckDB lets WHERE refer to a SELECT alias."
  - engine: SQLite
    note: "No error. SQLite lets WHERE refer to a SELECT alias."
---

PostgreSQL looked for a column with that name in the tables listed in `FROM` and didn't find one. If the name is obviously spelled right, the cause is almost always one of three things: it's an alias from `SELECT`, it's a string in double quotes, or it's an identifier whose case doesn't match.

## Why it happens

`stock_value` isn't a column of `demo.products`. It's a name the `SELECT` list gives to an expression:

```sql
SELECT name, price * stock_quantity AS stock_value
FROM demo.products
WHERE stock_value > 5000;
```

The clauses don't run in the order they're written. The database works out `FROM` first, then filters with `WHERE`, then groups, and only then evaluates `SELECT`. When `WHERE` runs, `stock_value` hasn't been computed yet, so there's nothing by that name to compare against.

`ORDER BY` runs after `SELECT`, which is why the same alias works there:

```sql
SELECT name, price * stock_quantity AS stock_value
FROM demo.products
ORDER BY stock_value DESC;
```

## How to fix it

**Repeat the expression** in `WHERE`. It's the shortest fix:

```sql
SELECT name, price * stock_quantity AS stock_value
FROM demo.products
WHERE price * stock_quantity > 5000;
```

Seven products have more than 5,000 worth of stock.

**Compute it once in a subquery** when the expression is long, or used in several places. The outer query sees the alias as an ordinary column:

```sql
SELECT *
FROM (
  SELECT name, price * stock_quantity AS stock_value
  FROM demo.products
) p
WHERE stock_value > 5000;
```

A CTE (`WITH p AS (...) SELECT ... FROM p WHERE ...`) does the same job and reads top to bottom.

If the alias is an aggregate, such as `COUNT(*) AS orders`, the filter belongs in `HAVING`, not `WHERE`. See [aggregate functions are not allowed in WHERE](/sql-errors/aggregate-functions-not-allowed-in-where).

## Double quotes are for names, not strings

In standard SQL, and in PostgreSQL, double quotes mark an identifier. Single quotes mark a string. This query asks for rows where `country` equals a column called `US`:

```sql
SELECT first_name
FROM demo.customers
WHERE country = "US";          -- column "US" does not exist
```

Use single quotes for the value:

```sql
SELECT first_name
FROM demo.customers
WHERE country = 'US';
```

Alice, Bob and Iris come back. MySQL treats double quotes as strings by default, so queries written for MySQL hit this the moment they move to PostgreSQL.

## Quoted identifiers are case-sensitive

PostgreSQL folds unquoted names to lower case. `SELECT First_Name` works, because it becomes `first_name`. Put the name in double quotes and the folding stops:

```sql
SELECT "First_Name" FROM demo.customers;
-- ERROR:  column "First_Name" does not exist
-- HINT:  Perhaps you meant to reference the column "customers.first_name".
```

The reverse catches people too. A table created by a tool that quoted mixed-case names, such as `"createdAt"`, has to be quoted with that exact case every time. Unquoted, `createdAt` folds to `createdat`, which doesn't exist.

When the message comes with a `HINT`, read it. PostgreSQL suggests a close match for typos and case mismatches, which is often the whole answer.
