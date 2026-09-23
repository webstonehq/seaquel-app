---
title: "Sorting with ORDER BY"
seoTitle: "SQL ORDER BY — Sorting Query Results | Seaquel"
description: "Sorting on one column or several, ascending and descending, where NULLs land, and why a query without ORDER BY has no guaranteed row order at all."
order: 40
demo: "order-by"
---

Rows in a table have no order. None. A table is a set, and the sequence you happen to see when you run `SELECT *` is an accident of how the database stored and retrieved the data. It can change when the table grows, when a row gets updated, when the query planner picks a different strategy.

So if the order of your results matters, you have to say so.

```sql
SELECT name, price
FROM demo.products
ORDER BY price;
```

Cheapest first: Cable Organizer at 12.99, then the USB Flash Drive at 14.99, up to the Headphones at 149.99.

## Direction

`ASC` is the default and almost nobody writes it. `DESC` reverses:

```sql
SELECT name, price
FROM demo.products
ORDER BY price DESC;
```

Direction is per column, not per query. In a multi-column sort each one carries its own:

```sql
SELECT name, category, price
FROM demo.products
ORDER BY category ASC, price DESC;
```

Accessories first with the Laptop Stand at the top of that group, then Electronics led by the Headphones, then Storage. The second column only matters inside groups of rows that tie on the first.

## Ties and stability

`ORDER BY category` alone leaves five Accessories rows tied, and SQL makes no promise about their relative order. Run it twice and you might get two different arrangements. This is fine until you're paginating, at which point a row can appear on both page one and page two while another never appears at all.

The fix is to break every tie explicitly, usually with something unique:

```sql
SELECT name, category
FROM demo.products
ORDER BY category, id;
```

Adding the primary key as a final tiebreaker costs nothing and makes the result deterministic. Do it on anything you paginate.

## Sorting by things that aren't columns

Aliases work here, because `ORDER BY` is evaluated after `SELECT`:

```sql
SELECT name, price * stock_quantity AS inventory_value
FROM demo.products
ORDER BY inventory_value DESC;
```

The USB-C Hub tops that list at 9,998, which is a decent illustration of why cheap high-volume stock can matter more than the expensive items.

Expressions work too, whether or not they appear in the select list:

```sql
SELECT first_name, last_name
FROM demo.customers
ORDER BY LENGTH(last_name), last_name;
```

You can also sort by position, which you should mostly avoid:

```sql
SELECT name, price FROM demo.products ORDER BY 2 DESC;
```

`2` means the second selected column. It saves typing and breaks silently the moment somebody inserts a column into the select list. The one place it earns its keep is with `GROUP BY` on long expressions, and even then naming the alias is clearer.

## Where NULLs go

Null isn't greater or less than anything, so each database just picks a convention. PostgreSQL, DuckDB and Oracle sort nulls last in ascending order. MySQL and SQLite sort them first. Nobody remembers which is which.

Five orders have no `shipped_at`:

```sql
SELECT id, status, shipped_at
FROM demo.orders
ORDER BY shipped_at;
```

If placement matters, state it rather than relying on the default:

```sql
SELECT id, status, shipped_at
FROM demo.orders
ORDER BY shipped_at DESC NULLS LAST;
```

`NULLS FIRST` and `NULLS LAST` are supported by PostgreSQL, DuckDB, SQLite and Oracle. MySQL doesn't have them, and the workaround there is to sort on `shipped_at IS NULL` first, which yields a 0 or 1 you can order by.

## Custom orderings

Sorting `status` alphabetically gives completed, pending, processing, shipped. That's useless, because the real sequence is pending → processing → shipped → completed. Map the values to numbers with `CASE`:

```sql
SELECT id, status, total_amount
FROM demo.orders
ORDER BY
  CASE status
    WHEN 'pending'    THEN 1
    WHEN 'processing' THEN 2
    WHEN 'shipped'    THEN 3
    WHEN 'completed'  THEN 4
  END,
  created_at;
```

Any status not listed returns null from the `CASE` and sorts wherever nulls sort. If you'd rather those land at the end, add `ELSE 99`.

## ORDER BY and LIMIT

Together they answer "top N" questions:

```sql
SELECT name, price
FROM demo.products
ORDER BY price DESC
LIMIT 3;
```

Headphones, External SSD, Mechanical Keyboard.

Two warnings. `LIMIT` without `ORDER BY` gives arbitrary rows, as covered earlier. And `LIMIT 3` after ordering by price gives exactly three rows even if the fourth product is tied with the third on price, silently cutting a tie in half. Standard SQL has `FETCH FIRST 3 ROWS WITH TIES` for this, which PostgreSQL and DuckDB support; otherwise you need a window function, which is where this course ends up.

One last thing worth internalising: `ORDER BY` runs near the end of the pipeline, after `WHERE` and `GROUP BY` have already done their work. Sorting a million rows and then throwing most of them away is expensive, so filter first and sort what's left.
