---
title: "The Practice Database"
seoTitle: "Free SQL Practice Database — Schema & Exercises | Seaquel"
description: "The full schema and sample data behind this course, a set of exercises from easy to hard, and a sandbox to run any query you like against it."
order: 120
demo: "sandbox"
---

No new concepts here. This is the reference page for the dataset the course runs on, plus exercises to practise against.

The sandbox at the bottom accepts any query. Nothing is saved and nothing leaves your browser, so you can `DROP TABLE` if you want to. Each run happens inside a transaction that gets rolled back afterwards, so the next one starts from the original data.

## Schema

```sql static
CREATE TABLE demo.customers (
  id          INTEGER PRIMARY KEY,
  email       VARCHAR(255) NOT NULL,
  first_name  VARCHAR(100),
  last_name   VARCHAR(100),
  created_at  TIMESTAMP,
  country     VARCHAR(2)
);

CREATE TABLE demo.products (
  id             INTEGER PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  category       VARCHAR(100),
  price          DECIMAL(10, 2),
  stock_quantity INTEGER,
  created_at     TIMESTAMP
);

CREATE TABLE demo.orders (
  id            INTEGER PRIMARY KEY,
  customer_id   INTEGER REFERENCES demo.customers(id),
  status        VARCHAR(50),
  total_amount  DECIMAL(10, 2),
  created_at    TIMESTAMP,
  shipped_at    TIMESTAMP
);

CREATE TABLE demo.order_items (
  id         INTEGER PRIMARY KEY,
  order_id   INTEGER REFERENCES demo.orders(id),
  product_id INTEGER REFERENCES demo.products(id),
  quantity   INTEGER,
  unit_price DECIMAL(10, 2)
);
```

Customers place orders, orders contain line items, line items point at products. `order_items` is a junction table, and it carries its own `unit_price` so that historical orders keep the price paid at the time rather than following the product's current price. That's a normal pattern in real systems and a good thing to notice.

## What's in it

**10 customers** across seven countries: US (Alice, Bob, Iris), Canada (Carol, Jack), UK (David), Germany (Emma), France (Frank), Japan (Grace), Australia (Henry). Signup dates run from January to March 2024.

**12 products** in three categories. Electronics: Wireless Mouse (29.99), Mechanical Keyboard (89.99), USB-C Hub (49.99), Webcam HD (69.99), Headphones (149.99). Accessories: Monitor Stand (39.99), Desk Lamp (24.99), Mouse Pad XL (19.99), Cable Organizer (12.99), Laptop Stand (59.99). Storage: External SSD 1TB (99.99), USB Flash Drive 64GB (14.99).

**10 orders** worth 1,289.81 in total, spread across four statuses: completed (4), shipped (1), processing (2), pending (3). Anything not yet shipped has a null `shipped_at`, which is five of them.

**17 line items**. Every order has at least one.

Deliberate quirks, because clean data teaches you nothing:

- Iris and Jack have never ordered. Useful for `LEFT JOIN` and `NOT EXISTS`.
- Half the orders have a null `shipped_at`. Useful for everything null-related.
- Orders 1, 3 and 5 have a `total_amount` that doesn't match their line items. See the reconciliation query in the subqueries lesson.

## Exercises

No solutions listed. Check your answers against the data, which is small enough to verify by eye.

**Warm-up**

1. Every product costing less than 30, cheapest first.
2. Customers outside the US, showing full name and country.
3. How many orders are in each status?
4. The three most recently created products.

**Joins**

5. Every order with the customer's full name attached.
6. Customers who have never placed an order. Write it twice, once with `LEFT JOIN` and once with `NOT EXISTS`.
7. Every line item with its product name and parent order status.
8. Which products have never been ordered?

**Aggregation**

9. Total revenue per category, using line items rather than order totals.
10. Average order value per status.
11. Customers with more than one order.
12. The single highest-value line item, showing product and customer.

**Harder**

13. Each customer's lifetime spend, including the two with none, showing 0 rather than null.
14. Products priced above their own category's average.
15. A running total of revenue by order date.
16. Each customer's first and second order date on one row.
17. The top two products by units sold within each category.
18. Month-over-month revenue change as a percentage.

Exercise 14 can be done with a correlated subquery or a window function. Doing it both ways, then comparing, is more instructive than either alone.

## Things to try in the sandbox

The schema browser shows all four tables and their columns without typing anything. Run `EXPLAIN` in front of any query to see the plan the engine chose. Select a query that returns two numeric columns and the visualiser will chart it.

If you break the data, the next run has it back.

## Where to go next

Point Seaquel at a database you actually care about. The gap between exercises and real work is mostly that real schemas are bigger, less tidy, and nobody tells you what the columns mean. Everything in this course still applies; there's just more of it.

[Download Seaquel](/download) for macOS, Windows or Linux. It's free for personal use.
