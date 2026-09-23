---
title: "for SELECT DISTINCT, ORDER BY expressions must appear in select list"
seoTitle: 'Fix "for SELECT DISTINCT, ORDER BY expressions must appear in select list" | Seaquel'
description: "Why PostgreSQL won't sort DISTINCT results by a column you didn't select, and how to get the order you meant with GROUP BY and an aggregate."
lesson: order-by
error: "for SELECT DISTINCT, ORDER BY expressions must appear in select list"
broken: |
  SELECT DISTINCT country
  FROM demo.customers
  ORDER BY created_at;
fixed: |
  SELECT country
  FROM demo.customers
  GROUP BY country
  ORDER BY MIN(created_at);
messages:
  - engine: MySQL
    text: "ERROR 3065 (HY000): Expression #1 of ORDER BY clause is not in SELECT list, references column 'demo.customers.created_at' which is not in SELECT list; this is incompatible with DISTINCT"
  - engine: SQL Server
    text: "Msg 145: ORDER BY items must appear in the select list if SELECT DISTINCT is specified."
  - engine: DuckDB
    note: "No error. The query doesn't define which created_at each country sorts by."
  - engine: SQLite
    note: "No error. The query doesn't define which created_at each country sorts by."
---

You asked for distinct values of one column, sorted by a different column. After `DISTINCT` collapses the rows, that other column no longer has a single value per row, so there's nothing well-defined to sort by.

## Why it happens

Ten customers live in seven countries. `SELECT DISTINCT country` returns seven rows. Three of the customers are in the US, and they signed up on three different dates:

```sql
SELECT first_name, created_at
FROM demo.customers
WHERE country = 'US'
ORDER BY created_at;
```

Alice on 15 January, Bob on 20 January, Iris on 10 March. When you write `ORDER BY created_at`, the single `US` row would have to sort by one of those three dates, and the query doesn't say which. PostgreSQL won't guess:

```sql
SELECT DISTINCT country
FROM demo.customers
ORDER BY created_at;
```

It's the same problem as [must appear in the GROUP BY clause](/sql-errors/column-must-appear-in-group-by). `DISTINCT` is grouping by every selected column, and `created_at` isn't one of them.

## How to fix it

Decide which date should represent each country, and say so with an aggregate. Switch from `DISTINCT` to `GROUP BY`, which lets you aggregate:

```sql
SELECT country
FROM demo.customers
GROUP BY country
ORDER BY MIN(created_at);
```

This sorts countries by their first signup: US, CA, UK, DE, FR, JP, AU. `MAX(created_at)` sorts by most recent signup instead. You can select the aggregate too if you want to see the date that drove the order.

**Don't just add the column to the select list.** It makes the error go away, but it changes what `DISTINCT` does:

```sql
SELECT DISTINCT country, created_at
FROM demo.customers
ORDER BY created_at;
```

Every customer has a different `created_at`, so every `(country, created_at)` pair is distinct. You get ten rows back, with the US three times, which is not a list of countries any more.

If you only needed a stable order and not a meaningful one, sort by the column you selected: `ORDER BY country`.

## Why some databases allow it

SQLite and DuckDB run the broken query without complaint. The query still doesn't say which of a country's dates to sort by, so the order you get is whatever the engine picks. On this dataset it happens to match the `MIN(created_at)` order, which is exactly why it's risky: nothing guarantees it stays that way as the data changes.
