---
title: Exporting Data
description: Export query results to CSV, JSON, SQL, or Markdown.
---

Seaquel supports exporting query results in four formats, so you can move data into spreadsheets, scripts, documentation, or other tools.

## Export formats

### CSV

RFC 4180 compliant. Values are properly escaped and quoted, making them safe to import into Excel, Google Sheets, or any CSV-compatible tool.

### JSON

Pretty-printed with 2-space indentation. Each row becomes a JSON object with column names as keys.

### SQL

INSERT statements with proper value escaping. You can configure the target table name before exporting — useful when migrating data or generating seed files.

### Markdown

Pipe-delimited table format, ready to paste into GitHub issues, pull requests, or documentation files.

## Export scope

You can export:

- **Current page** — only the rows visible on the current page
- **All results** — the complete result set across all pages

## Copy options

For quick sharing without saving a file:

- **Copy row as JSON** — copies a single row as a JSON object
- **Copy column values** — copies all values from a selected column

## File export

Use the export button to save results directly to a file on your machine. Choose your format, set the scope, and pick a destination.
