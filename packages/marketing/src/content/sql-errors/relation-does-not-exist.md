---
title: 'relation "x" does not exist'
seoTitle: 'Fix "relation does not exist" in PostgreSQL: schemas, search_path and quotes | Seaquel'
description: "The table exists, but PostgreSQL can't find it. Usually the cause is a schema missing from search_path, a quoted mixed-case name, or the wrong database."
lesson: select
error: 'relation "customers" does not exist'
broken: |
  SELECT first_name, country
  FROM customers;
fixed: |
  SELECT first_name, country
  FROM demo.customers;
codes:
  postgresql: '42P01'
  mysql: '1146'
  sql-server: '208'
messages:
  - engine: MySQL
    text: "ERROR 1146 (42S02): Table 'mydb.customers' doesn't exist"
  - engine: SQL Server
    text: "Msg 208: Invalid object name 'customers'."
  - engine: Oracle
    text: "ORA-00942: table or view does not exist"
  - engine: SQLite
    text: "no such table: customers"
  - engine: DuckDB
    text: 'Catalog Error: Table with name customers does not exist! Did you mean "demo.customers"?'
---

PostgreSQL looked for a table (a "relation", in its terms) with that name and didn't find one. Sometimes the table really is missing. More often it exists, but the query names it in a way PostgreSQL doesn't resolve to it.

## Why it happens

Every PostgreSQL table lives in a schema. When you write a name without one, PostgreSQL checks only the schemas on your `search_path`, which by default is `"$user", public`: a schema named after your login role, then `public`. It doesn't search any other schema.

The practice database keeps its tables in a schema called `demo`, so this fails even though `demo.customers` has ten rows:

```sql
SELECT first_name, country
FROM customers;
```

The message quotes the name exactly as PostgreSQL searched for it. `relation "customers"` means it looked for an unqualified `customers` on the search path. `relation "demo.Customers"` means it looked in `demo` for a table whose name has a capital C.

## How to fix it

**The table is in another schema.** Qualify the name:

```sql
SELECT first_name, country
FROM demo.customers;
```

Or put the schema on the search path for the session, after which unqualified names resolve:

```sql
SET search_path TO demo, public;
SELECT first_name, country FROM customers;
```

`SHOW search_path` prints the current setting. To make the change permanent for a role, use `ALTER ROLE ... SET search_path`. Many ORMs and migration tools also have their own schema setting.

**The name has capitals and was created with quotes.** PostgreSQL lowercases every unquoted identifier, so `demo.Customers` and `demo.CUSTOMERS` both find `customers`. A quoted identifier keeps its case:

```sql
SELECT * FROM demo."Customers";     -- relation "demo.Customers" does not exist
```

The reverse catches people more often. A tool that generates DDL, or a migration written as `CREATE TABLE "Customers"`, creates a table whose name really is `Customers`. That table can then only be reached by writing `"Customers"`, quotes included, in every query.

**The quotes span the schema and the table.** `"demo.customers"` is a single identifier containing a dot, not a schema plus a table. Quote each part separately: `"demo"."customers"`.

**You're connected to the wrong database.** Schemas don't cross databases. If the table is in `analytics` and your connection points at `postgres`, no search path will find it. Check the database name in your connection settings.

## Finding out where the table actually is

When you don't know the schema or the exact spelling, ask the catalog:

```sql
SELECT table_schema, table_name
FROM information_schema.tables
WHERE table_name ILIKE '%customer%';
```

This returns `demo | customers`. If it returns nothing, the table isn't in this database, or your role has no privileges on it: `information_schema` only lists tables you have some privilege on.
