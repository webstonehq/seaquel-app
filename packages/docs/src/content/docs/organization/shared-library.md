---
title: Shared Library
description: Collaborate with your team through Git-synced query repositories.
---

The Shared Library lets your team share SQL queries through Git repositories. Everyone works from the same collection of queries, with full version control and conflict resolution.

## Adding a repository

1. Open the **Manage** panel from the sidebar.
2. Click **Add Repository**.
3. Enter the remote URL (HTTPS or SSH).
4. Choose a branch (defaults to `main`).
5. Provide credentials if required.

### Authentication

- **HTTPS** — username and password, or a personal access token
- **SSH** — select your SSH key, with optional passphrase

Credentials are stored securely in your system keyring.

## Query format

Shared queries are `.sql` files with YAML frontmatter:

```sql
---
name: Active users last 30 days
description: Find users who logged in recently
database: postgresql
tags: [users, analytics]
parameters:
  - name: days
    type: integer
    default: 30
---
SELECT * FROM users
WHERE last_login > NOW() - INTERVAL '{{days}} days';
```

Folder structure in the repository is preserved, so you can organize queries into directories by team, project, or topic.

## Sync status

Each repository shows its current sync state:

- **Synced** — local and remote match
- **Ahead** — you have unpushed changes
- **Behind** — the remote has new changes
- **Diverged** — both local and remote have changed
- **Error** — sync failed (check credentials or network)

The last sync timestamp is displayed alongside the status.

## Pushing and pulling

- **Pull** — fetch the latest changes from the remote
- **Push** — send your local changes to the remote

When conflicts occur, Seaquel provides a 3-way merge editor so you can resolve differences without leaving the app. Modified and untracked files are highlighted before you push.

## Browsing shared queries

Use the Manage panel to browse, search, and open shared queries. Click any query to load it into a new tab.
