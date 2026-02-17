---
title: Interface Overview
description: "A tour of the Seaquel interface: sidebar, editor, results, and more."
---

Seaquel's interface is organized around a few key areas. Here's what you'll find in each.

## Sidebar

The left sidebar shows your connections and schema browser. Expand a connection to see databases, schemas, tables, and views — each table displays its row count. Toggle the sidebar with `Cmd+B` (Mac) or `Ctrl+B` (Windows/Linux).

## Query Editor

The center of the window is a Monaco-based SQL editor with syntax highlighting, autocomplete, and error markers. You can work with multiple tabs:

- **New tab** — `Cmd+T` / `Ctrl+T`
- **Close tab** — `Cmd+W` / `Ctrl+W`
- **Switch tabs** — `Cmd+1` through `Cmd+9` / `Ctrl+1` through `Ctrl+9`

## Results Panel

Below the editor, the results panel shows query output in a virtual-scrolling grid. You can paginate through large result sets, edit cells inline, and export data to CSV, JSON, SQL, or Markdown.

## Toolbar

The toolbar above the editor provides quick access to common actions:

| Action | Shortcut |
|--------|----------|
| Execute query | `Cmd+Enter` / `Ctrl+Enter` |
| Format SQL | `Cmd+Shift+F` / `Ctrl+Shift+F` |
| Save query | `Cmd+S` / `Ctrl+S` |
| EXPLAIN query | toolbar button |

## Command Palette

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open the command palette. From here you can search commands, switch tabs, change connections, and navigate to any table — all without touching the mouse.

## AI Assistant

The floating AI panel lets you describe what you need in plain language and get SQL back. Open it from the toolbar or the command palette.

## Canvas

The visual canvas is an infinite workspace where you can lay out tables, queries, results, and charts as nodes. Access it from the sidebar. See [Canvas](/visual-tools/canvas/) for details.

## Status Bar

The bottom status bar shows your current connection, last query execution time, and row count.
