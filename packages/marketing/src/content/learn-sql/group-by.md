---
title: "GROUP BY"
seoTitle: "SQL GROUP BY Explained with Examples | Seaquel"
description: "How GROUP BY buckets rows before aggregating, why every non-aggregated column must be grouped, grouping on multiple columns and on expressions."
order: 60
demo: "group-by"
---

An aggregate on its own squashes the whole table into one row. `GROUP BY` squashes it into one row per bucket instead.

```sql
SELECT category, COUNT(*) AS product_count
FROM demo.products
GROUP BY category;
```

Three rows out, because there are three categories: Electronics with 5, Accessories with 5, Storage with 2.

The mental model that works: the database sorts the rows into piles, one pile per distinct value of `category`, then runs your aggregates separately on each pile and emits one row per pile.

## The rule about the select list

Every column in `SELECT` must be either inside an aggregate or named in `GROUP BY`. No exceptions, and it follows directly from what grouping does.

```sql
SELECT category, name, COUNT(*)
FROM demo.products
GROUP BY category;                 -- error
```

The Electronics pile contains five different names. `COUNT(*)` knows what to do with five rows; `name` doesn't. The database refuses rather than picking one arbitrarily.

MySQL used to allow this and return whichever name it felt like. That behaviour is off by default in modern versions, but plenty of old queries and old tutorials depend on it, so you'll still run into it.

## Grouping on more than one column

Listing several columns groups on the combination:

```sql
SELECT
  customer_id,
  status,
  COUNT(*)          AS orders,
  SUM(total_amount) AS amount
FROM demo.orders
GROUP BY customer_id, status
ORDER BY customer_id;
```

One row per distinct `(customer_id, status)` pair. Alice has two completed orders, so she gets one row with a count of 2. Bob has one completed and one pending, so he gets two rows.

More grouping columns means more, smaller groups. Group on enough columns and you're back to one row per input row, which is a sign you didn't want to aggregate at all.

## Grouping on expressions

You can group by something computed, as long as `SELECT` and `GROUP BY` agree:

```sql
SELECT
  EXTRACT(MONTH FROM created_at) AS month,
  COUNT(*)                       AS orders,
  SUM(total_amount)              AS revenue
FROM demo.orders
GROUP BY EXTRACT(MONTH FROM created_at)
ORDER BY month;
```

February has four orders, March has six.

Repeating the expression is tedious. PostgreSQL, MySQL and SQLite all let you group by the output alias or by column position:

```sql
GROUP BY month      -- alias, widely supported though not standard
GROUP BY 1          -- first column in the select list
```

Aliases are the readable option. Positional grouping is common in analytics code and turns into a mess the moment someone reorders the select list.

Date truncation is the usual real-world case, and every engine spells it differently. PostgreSQL has `DATE_TRUNC('month', created_at)`, MySQL has `DATE_FORMAT(created_at, '%Y-%m')`, SQLite uses `strftime('%Y-%m', created_at)`.

## Counting within groups

`COUNT(*)` counts rows in the group. `COUNT(column)` counts non-null values in the group, and `COUNT(DISTINCT column)` counts unique ones. All three can appear side by side:

```sql
SELECT
  status,
  COUNT(*)                    AS orders,
  COUNT(shipped_at)           AS shipped,
  COUNT(DISTINCT customer_id) AS customers
FROM demo.orders
GROUP BY status;
```

For `pending` you get 3 orders, 0 shipped, 3 customers. For `completed`, 4 orders, 4 shipped, 3 customers, since Alice placed two of them.

## Groups that don't exist

A group only appears if at least one row falls into it. Nothing in this dataset has status `refunded`, so no `refunded` row comes back. This bites when you're building a chart and expect a bar for every category, or a row for every month in a range including the quiet ones.

There's no way to invent those rows with `GROUP BY` alone. You generate the full list of buckets separately and `LEFT JOIN` your aggregated data onto it. `generate_series` does the generating in PostgreSQL; elsewhere you keep a calendar table around.

## GROUP BY with a join

Grouping after a join is where most real queries live, and where the fan-out problem from the joins lesson comes back:

```sql
SELECT
  c.first_name,
  c.last_name,
  COUNT(o.id)              AS order_count,
  SUM(o.total_amount)      AS lifetime_value
FROM demo.customers c
LEFT JOIN demo.orders o ON o.customer_id = c.id
GROUP BY c.id, c.first_name, c.last_name
ORDER BY lifetime_value DESC NULLS LAST;
```

Two details are doing real work here.

`COUNT(o.id)` rather than `COUNT(*)`. With a `LEFT JOIN`, Iris and Jack each produce one row with every order column null. `COUNT(*)` counts that row and reports 1 order each. `COUNT(o.id)` skips nulls and correctly reports 0.

And `GROUP BY c.id, ...` rather than grouping on names. Two customers could share a name; ids can't collide. Grouping on the primary key and listing the other columns alongside is the safe habit. PostgreSQL will actually let you write `GROUP BY c.id` alone and select the other columns, because they can prove the key determines them, but spelling it out works everywhere.

Their `lifetime_value` comes back null rather than 0, for the reason covered in the aggregates lesson. `COALESCE(SUM(o.total_amount), 0)` if you want a number.

Next up is filtering the groups themselves, which needs a different clause than `WHERE`.
