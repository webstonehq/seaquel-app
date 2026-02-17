---
title: Query Parameters
description: Use template variables for reusable, parameterized queries.
---

Query parameters let you write reusable SQL with placeholder values that you fill in at execution time.

## Syntax

Wrap parameter names in double curly braces:

```sql
SELECT * FROM users WHERE created_at > {{start_date}}
```

```sql
SELECT * FROM orders
WHERE status = {{status}} AND total > {{min_total}}
```

Parameters are visually highlighted in the editor so you can spot them at a glance.

## Filling in values

When you execute a query that contains parameters, a dialog appears prompting you to enter a value for each one.

Each parameter supports a type:

- **Text** — string values
- **Number** — integer or decimal values
- **Date** — date picker
- **Datetime** — date and time picker
- **Boolean** — true/false toggle

You can set optional default values so the dialog is pre-filled for parameters you use often.

## When to use parameters

Parameters are ideal for queries you run repeatedly with different inputs — filtering by date ranges, looking up specific records, or testing different conditions without editing the SQL each time.
