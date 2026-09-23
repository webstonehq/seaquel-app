---
title: "Filtering with WHERE"
seoTitle: "SQL WHERE Clause — Filtering Rows Explained | Seaquel"
description: "Comparison operators, AND/OR precedence, IN, BETWEEN, LIKE, and the NULL behaviour that makes WHERE quietly drop rows you expected to see."
order: 30
demo: "where"
---

`WHERE` throws away rows. It runs once per row, and whatever it evaluates to true for survives into the result.

```sql
SELECT name, price
FROM demo.products
WHERE price > 50;
```

Five products come back out of twelve: the Mechanical Keyboard, Webcam HD, Headphones, Laptop Stand and External SSD. The Desk Lamp at 24.99 doesn't make the cut.

## Operators

The comparisons are what you'd guess: `=`, `<`, `>`, `<=`, `>=`. Not equal is `<>` in the standard, and `!=` also works nearly everywhere. Pick one and stay consistent.

```sql
SELECT name, category, price
FROM demo.products
WHERE category <> 'Electronics';
```

Text comparisons are case sensitive in PostgreSQL and DuckDB. `'electronics'` matches nothing here. MySQL's default collation is case insensitive, so the same query behaves differently there, which is a genuinely annoying source of bugs when moving queries between engines.

## Combining conditions

`AND` and `OR` do what you expect until they don't. `AND` binds tighter than `OR`, exactly like `*` binds tighter than `+`. This query is not asking what it looks like it's asking:

```sql
SELECT name, category, price
FROM demo.products
WHERE category = 'Electronics' OR category = 'Storage' AND price < 50;
```

It reads as `Electronics OR (Storage AND price < 50)`, so every Electronics product comes back regardless of price. If you wanted cheap items from either category, parenthesise:

```sql
WHERE (category = 'Electronics' OR category = 'Storage') AND price < 50;
```

Now you get the Wireless Mouse, USB-C Hub and USB Flash Drive. Use brackets whenever `AND` and `OR` appear together, even when you're confident about precedence. The next person to read the query won't be.

## IN and BETWEEN

A chain of `OR`s against the same column collapses into `IN`:

```sql
SELECT name, category
FROM demo.products
WHERE category IN ('Electronics', 'Storage');
```

`BETWEEN` is inclusive on both ends, which catches people out:

```sql
SELECT name, price
FROM demo.products
WHERE price BETWEEN 20 AND 50;
```

That includes anything priced exactly 20 or exactly 50. With dates the inclusivity gets dangerous. `BETWEEN '2024-02-01' AND '2024-02-29'` on a timestamp column silently excludes almost all of 29 February, because a bare date is midnight and an order placed at 14:00 that day is after it. Use `>= '2024-02-01' AND < '2024-03-01'` for date ranges and the problem disappears.

## Pattern matching with LIKE

`%` matches any run of characters, `_` matches exactly one.

```sql
SELECT name FROM demo.products WHERE name LIKE '%USB%';
```

Two products: the USB-C Hub and the USB Flash Drive 64GB.

```sql
SELECT email FROM demo.customers WHERE email LIKE 'a%';
```

One: alice@example.com.

`LIKE` is case sensitive on PostgreSQL and DuckDB. Postgres offers `ILIKE` for the case-insensitive version; elsewhere you wrap both sides in `LOWER()`. A leading `%` also means the database can't use an index on that column, so on a large table `LIKE '%thing%'` is a full scan. Fine on twelve products, less fine on twelve million.

## NULL

This is the part of `WHERE` that actually bites.

`NULL` means unknown. It is not zero, not an empty string, not false. Any comparison with an unknown value produces unknown rather than true or false, and `WHERE` keeps only rows where the condition came out true.

Five of the ten orders have `shipped_at = NULL`. This query returns nothing at all:

```sql
SELECT id, status FROM demo.orders WHERE shipped_at = NULL;
```

Not an error, not a warning. Zero rows. `shipped_at = NULL` evaluates to unknown for every row, including the rows where `shipped_at` genuinely is null. You need the dedicated operator:

```sql
SELECT id, status FROM demo.orders WHERE shipped_at IS NULL;      -- 5 rows
SELECT id, status FROM demo.orders WHERE shipped_at IS NOT NULL;  -- 5 rows
```

The subtler version of the same problem is negation. You'd expect these two queries to cover all ten orders between them:

```sql
SELECT COUNT(*) FROM demo.orders WHERE status = 'pending';   -- 3
SELECT COUNT(*) FROM demo.orders WHERE status <> 'pending';  -- 7
```

They do here, because `status` is never null. If it were, the null rows would fall out of *both* counts and the totals wouldn't add up. Any time a `<>` filter returns fewer rows than you expect, check whether the column is nullable. To include nulls explicitly you have to ask:

```sql
WHERE status <> 'pending' OR status IS NULL
```

Some engines give you `IS DISTINCT FROM`, which treats null as a normal comparable value and does the above in one operator. PostgreSQL and DuckDB have it, MySQL spells it `<=>` with inverted meaning.

## Filtering on computed values

You can filter on an expression:

```sql
SELECT name, price, stock_quantity
FROM demo.products
WHERE price * stock_quantity > 5000;
```

What you can't do is filter on an alias you defined in the same `SELECT`. `WHERE` is evaluated before `SELECT`, so the alias doesn't exist yet. Repeat the expression, or wrap the query in a subquery and filter outside it.

Next: putting the surviving rows in a sensible order.
