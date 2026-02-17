---
title: Quick Start
description: Connect to a database and run your first query in under 5 minutes.
---

This guide walks you through connecting to a database and executing your first query.

## Connect to a database

1. Open Seaquel.
2. Click **New Connection**.
3. Choose your database type: PostgreSQL, MySQL, SQLite, DuckDB, or MSSQL.
4. Fill in the connection details — host, port, database, user, and password. You can also paste a connection string directly.
5. Click **Test Connection** to verify everything works.
6. Click **Save & Connect**.

## Run your first query

7. A new query tab opens automatically after connecting.
8. Type the following in the editor:
   ```sql
   SELECT 1;
   ```
9. Press `Cmd+Enter` (Mac) or `Ctrl+Enter` (Windows/Linux) to execute.
10. Results appear in the grid below the editor.

That's it — you're up and running.

## Next steps

- **Browse your schema** — expand tables and views in the left sidebar.
- **Open the command palette** — press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to search commands, switch tabs, jump to tables, and more.
- **Learn the interface** — see the [Interface Overview](/docs/getting-started/interface-overview/) for a full tour of the Seaquel workspace.
