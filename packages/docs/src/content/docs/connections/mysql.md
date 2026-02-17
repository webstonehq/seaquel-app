---
title: MySQL
description: Connect to MySQL and MariaDB databases with Seaquel.
---

Seaquel supports both MySQL and MariaDB with the same connection type.

## Connection details

| Field | Default |
| --- | --- |
| Host | `localhost` |
| Port | `3306` |
| Database | — |

Connection string format:

```
mysql://user:password@host:3306/database
```

## Authentication

Standard username and password authentication. Credentials are stored securely in your system keychain.

## SSL support

Enable SSL in the connection settings for encrypted connections. Recommended for any connection over the internet or to cloud-hosted databases.

## SSH tunnels

For databases behind firewalls, use an [SSH tunnel](/docs/connections/ssh-tunnels/) to connect securely through a jump server.

## MariaDB

MariaDB connections use the same MySQL connection type. Seaquel auto-detects MariaDB and handles dialect differences transparently.
