---
title: Practice Database
description: A built-in e-commerce sample database for learning SQL.
---

Seaquel ships with a built-in sample database so you can start writing queries immediately — no server setup, no configuration, no sample data to import.

## What's included

The practice database models a simplified e-commerce platform with realistic data. Tables include common patterns you'll encounter in real applications:

- **Users** — customer accounts with names, emails, and signup dates
- **Products** — items with prices, categories, and descriptions
- **Orders** — purchases linking users to order totals and timestamps
- **Order items** — individual line items connecting orders to products
- **Categories** — product groupings
- **Reviews** — product ratings and comments from users

## Using the practice database

The practice database is automatically available in the [SQL tutorials](/learn-sql/tutorials/). You can also connect to it directly:

1. Open the sidebar.
2. Select the **Practice Database** connection.
3. Start writing queries in a new tab.

## What you can practice

The schema is designed to cover common SQL patterns:

- **JOINs** — link users to their orders, orders to products, products to reviews
- **Aggregations** — calculate order totals, average ratings, sales by category
- **Filtering** — find orders in a date range, products above a price threshold
- **Subqueries** — top customers, best-selling products, above-average orders
- **Window functions** — rank products by sales, running totals per customer

## Resetting data

If you modify the practice data and want a fresh start, reset it from the connection settings. This restores all tables and data to their original state.
