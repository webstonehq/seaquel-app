---
title: Writing Queries
description: Use the Monaco-powered SQL editor with autocomplete and syntax highlighting.
---

Seaquel's query editor is built on Monaco — the same engine behind VS Code. It gives you syntax highlighting, autocomplete, and code folding for SQL across all supported databases.

## Syntax highlighting

The editor highlights SQL syntax for PostgreSQL, MySQL, SQLite, DuckDB, and MSSQL. Keywords, strings, numbers, comments, and identifiers are color-coded automatically based on your active connection.

## Schema-aware autocomplete

Autocomplete draws from your actual database schema. As you type, Seaquel suggests:

- **Table names** from the current schema
- **Column names** from tables in your FROM and JOIN clauses
- **Alias resolution** — if you alias a table (`FROM users u`), typing `u.` suggests columns from `users`
- **SQL keywords** appropriate to your current context

Suggestions adapt based on where your cursor is. You get different completions in SELECT, FROM, WHERE, ON, ORDER BY, GROUP BY, HAVING, and SET clauses.

## Editor features

- **Tab size**: 2 spaces
- **Word wrapping**: enabled by default
- **Line numbers**: always visible
- **Code folding**: collapse and expand blocks using the gutter controls
