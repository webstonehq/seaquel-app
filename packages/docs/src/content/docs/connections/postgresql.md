---
title: PostgreSQL
description: Connect to PostgreSQL databases with Seaquel.
---

## Connection details

| Field | Default |
| --- | --- |
| Host | `localhost` |
| Port | `5432` |
| Database | `postgres` |

Connection string format:

```
postgresql://user:password@host:5432/database
```

## SSL modes

PostgreSQL supports multiple SSL modes. Set them in the connection form:

- **Disable** — no encryption
- **Allow** — use SSL if the server supports it
- **Prefer** — try SSL first, fall back to unencrypted
- **Require** — enforce SSL, reject unencrypted connections

Use **Require** for production databases and cloud providers.

## Common configurations

**Local development:** `localhost:5432` with your local user, SSL disabled.

**Cloud providers** (AWS RDS, Supabase, Neon, etc.): use the connection string from your provider's dashboard. Enable SSL — most cloud providers require it.

**Remote servers:** combine with an [SSH tunnel](/docs/connections/ssh-tunnels/) to connect through bastion hosts or jump servers.

## Features

Seaquel provides full schema browsing for PostgreSQL: tables, views, functions, indexes, and constraints. [Statistics](/docs/schema/statistics/) are fully supported with table sizes and index usage monitoring.
