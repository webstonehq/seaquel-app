---
title: SSL / TLS
description: Configure SSL/TLS encryption for database connections.
---

SSL/TLS encrypts the connection between Seaquel and your database server, preventing eavesdropping and man-in-the-middle attacks.

## SSL modes

| Mode | Behavior |
| --- | --- |
| **Disable** | No encryption. Use only for trusted local connections. |
| **Allow** | Connects without SSL, but upgrades if the server supports it. |
| **Prefer** | Tries SSL first, falls back to unencrypted if unavailable. |
| **Require** | Enforces SSL. Rejects the connection if SSL is unavailable. |

## Recommendations

- **Local development** — Disable or Allow is usually fine for `localhost`.
- **Cloud databases** — Use **Require**. Most cloud providers (AWS RDS, Supabase, PlanetScale, Azure SQL) require or strongly recommend SSL.
- **Production** — Always use **Require**.

## Certificate configuration

For databases using self-signed certificates, you may need to provide certificate files in the connection settings. Check your database provider's documentation for the correct CA certificate.

## Database support

SSL/TLS is available for database types that support it:

- PostgreSQL — full SSL mode support
- MySQL — SSL encryption
- MSSQL — TLS encryption
