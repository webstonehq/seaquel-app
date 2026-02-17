---
title: SQLite
description: Open SQLite database files in Seaquel.
---

SQLite connections are file-based — no server required. Seaquel runs SQLite embedded, so you can work with local databases anywhere.

## Connecting

1. Click **New Connection** and select **SQLite**.
2. Choose your database file using the file picker, or type the path directly.
3. Click **Save & Connect**.

Supported file extensions: `.db`, `.sqlite`, `.sqlite3`, or any file containing a valid SQLite database.

## Use cases

- **Local development** — inspect databases created by your app
- **Mobile app databases** — open SQLite files from iOS or Android backups
- **Testing** — query test fixtures or seed data
- **Data files** — explore data distributed as SQLite databases

## Full SQL support

Seaquel supports all SQLite SQL syntax, including `PRAGMA` commands for inspecting database settings, page size, journal mode, and more.
