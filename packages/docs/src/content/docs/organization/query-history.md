---
title: Query History
description: Browse and search your recent queries with timestamps and execution times.
---

Seaquel automatically records every query you execute, so you can always find and re-run past work. History persists across sessions and is stored locally on your machine.

## What gets recorded

Each history entry captures:

- **SQL text** — the full query as executed
- **Timestamp** — when the query ran
- **Execution time** — duration in milliseconds
- **Row count** — rows returned or affected
- **Connection name** — which connection was active
- **Labels** — any labels assigned to the connection at execution time

Seaquel stores up to 500 queries per connection.

## Browsing history

1. Open the sidebar.
2. Select the **History** section.
3. Scroll through entries, ordered by most recent first.

Each entry shows a preview of the SQL along with the timestamp and execution time.

## Searching history

Use the search field at the top of the history panel to filter entries. Full-text search matches against the SQL content, so you can search for table names, keywords, or specific clauses.

## Favorites

Star any history entry to mark it as a favorite. Favorited queries appear at the top of the list for quick access. Click the star icon again to remove a favorite.

## Re-running a query

Click any history entry to open it in a new query tab. The full SQL text is loaded into the editor, ready to execute or modify.
