---
title: "The SELECT Statement"
seoTitle: "SQL SELECT Statement — Interactive Tutorial | Seaquel"
description: "Choosing columns, renaming them, computing new ones, removing duplicates and limiting results. Plus the evaluation order that explains most beginner errors."
order: 20
demo: "select"
---

Every query you ever write will start with `SELECT`. It answers one question: which columns, from which rows, do you want back?

```sql
SELECT first_name, last_name
FROM demo.customers;
```

Two columns, ten rows. The columns come back in the order you listed them, not the order they sit in the table.

`*` means everything:

```sql
SELECT * FROM demo.customers;
```

Fine while you're poking around. A bad habit in anything you keep, because it breaks silently when someone adds a column, moves more data than you need, and tells the next reader nothing about what you actually wanted. Name your columns once you know which ones they are.

## Renaming with AS

Column names are written for storage, not for reading. `AS` fixes that in the output:

```sql
SELECT
  first_name AS "First name",
  email      AS "Email address",
  country    AS "Country code"
FROM demo.customers;
```

The `AS` is optional. `first_name "First name"` does the same thing, and leaving `AS` in is easier to read.

Quoting matters more. Double quotes are for identifiers, single quotes are for string values, and mixing them up is probably the most common syntax error in SQL:

```sql
SELECT 'first_name' FROM demo.customers;  -- the literal text, ten times
SELECT "first_name" FROM demo.customers;  -- the column
```

MySQL uses backticks for identifiers instead of double quotes, which is its own small source of friction when moving queries around.

## Computing columns

The select list isn't restricted to columns that exist:

```sql
SELECT
  name,
  price,
  price * 0.9 AS sale_price
FROM demo.products;
```

Concatenation joins text. Standard SQL, PostgreSQL and DuckDB use `||`:

```sql
SELECT
  first_name || ' ' || last_name AS full_name,
  email
FROM demo.customers;
```

MySQL wants `CONCAT(first_name, ' ', last_name)`, since `||` means logical OR there. This is one of many places where "SQL" turns out to be several languages sharing a name.

Careful with nulls in concatenation. Any null in a `||` chain makes the whole result null in most engines, so a customer with no last name gives you null rather than their first name. `COALESCE(last_name, '')` is the usual guard.

## DISTINCT

```sql
SELECT DISTINCT category FROM demo.products;
```

Three rows: Electronics, Accessories, Storage.

The detail people miss is that `DISTINCT` applies to the entire selected row, not the first column:

```sql
SELECT DISTINCT category FROM demo.products;
-- 3 rows, one per category

SELECT DISTINCT category, price FROM demo.products;
-- 12 rows, because no two products share both
```

There's also a habit worth breaking before you form it. If you reach for `DISTINCT` to clear up a surprise pile of duplicate rows, stop and find out where they came from. Duplicates after a join almost always mean the join is multiplying rows, and `DISTINCT` hides that while leaving the arithmetic wrong. The joins lesson covers it properly.

## LIMIT

Production tables have millions of rows. `LIMIT` caps what comes back:

```sql
SELECT name, price
FROM demo.products
LIMIT 5;
```

Those are five arbitrary products. Not the first five, not the cheapest five, just whichever five the engine produced first, and that can change between runs. Ask for the five cheapest and you have to say so, which is `ORDER BY`, two lessons along.

SQL Server spells this `SELECT TOP 5`. Older Oracle uses `ROWNUM`. PostgreSQL, MySQL, SQLite and DuckDB all use `LIMIT`.

## The order SQL actually runs in

You write a query beginning with `SELECT`. The database evaluates it beginning with `FROM`:

```
FROM      →  which tables
WHERE     →  which rows
GROUP BY  →  how to bucket them
HAVING    →  which buckets survive
SELECT    →  which columns, computed
ORDER BY  →  what order
LIMIT     →  how many
```

`SELECT` is sixth of seven. Once you know that, a whole family of confusing errors becomes obvious instead.

This one, for instance:

```sql
SELECT price * 0.9 AS sale_price
FROM demo.products
WHERE sale_price < 30;        -- sale_price does not exist
```

`WHERE` runs third, `SELECT` runs sixth, so at the moment `WHERE` is evaluated the alias hasn't been created. Repeat the expression:

```sql
SELECT price * 0.9 AS sale_price
FROM demo.products
WHERE price * 0.9 < 30;
```

Aliases *do* work in `ORDER BY`, because that runs after `SELECT`. The asymmetry looks arbitrary until you know the pipeline, at which point it's just a consequence.

Keep that seven-line list somewhere. It explains `HAVING` versus `WHERE`, why you can't filter on a window function, and most of the "column does not exist" errors you'll hit over the next month.

Next: cutting the ten rows down to the ones you want.
