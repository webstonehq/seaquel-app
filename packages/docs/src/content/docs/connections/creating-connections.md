---
title: Creating Connections
description: Create and configure database connections in Seaquel.
---

Seaquel stores all connections securely on your device using keychain integration. No cloud accounts, no telemetry.

## Two ways to connect

### Connection form

1. Click **New Connection**.
2. Choose a database type: PostgreSQL, MySQL, SQLite, DuckDB, or MSSQL.
3. Fill in the fields: name, host, port, database, username, and password.
4. Click **Test Connection** to verify.
5. Click **Save & Connect**.

### Connection string

1. Click **New Connection**.
2. Switch to **Connection String** mode.
3. Paste a URI, for example:
   ```
   postgresql://user:password@host:5432/database
   ```
4. Seaquel parses the string and fills in the form fields automatically.
5. Click **Test Connection**, then **Save & Connect**.

## Connection security

- Credentials are stored in your system's keychain (macOS Keychain, Windows Credential Manager, or Linux Secret Service).
- Your data never leaves your machine.
- No accounts or cloud sync required.

## Managing connections

Saved connections appear in the sidebar. Right-click a connection to edit, duplicate, or delete it. Connections persist across app restarts.
