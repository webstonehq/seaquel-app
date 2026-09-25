/**
 * Alt text for the feature screenshots in `$lib/assets/features/`, keyed by
 * `<category>/<file>`. Each entry describes what the screenshot actually
 * shows rather than repeating the feature name, since this is what screen
 * readers, search engines and AI assistants read. When a screenshot is
 * replaced, update its entry here too.
 */
const SCREENSHOT_ALT: Record<string, string> = {
	"ai-assistant/dashboard-generation.webp": "Seaquel AI Assistant panel with a prompt to generate an e-commerce overview dashboard beside the resulting grid of KPI tiles, bar, pie, area and scatter charts.",
	"ai-assistant/mentions.webp": "Seaquel AI Assistant chat showing an @-mention menu listing tables, saved queries and dashboards while asking for index suggestions on the E-Commerce Overview dashboard.",
	"ai-assistant/natural-language-to-sql.webp": "Seaquel inline AI prompt asking for the top 10 customers by revenue this quarter above the generated SQL join query and its two-row result table.",
	"ai-assistant/optional-by-design.webp": "Seaquel Settings Features page with the AI toggle switched off, leaving no AI settings section in the sidebar, while Learn and Pending Changes stay enabled.",
	"ai-assistant/privacy-at-the-core.webp": "Seaquel AI Privacy settings with toggles for sharing the database schema with the AI and for letting the AI run read-only SELECT queries with approval.",

	"connection-features/connection-persistence.webp": "Seaquel Get Started screen listing saved connections in the sidebar and a Recent Connections panel with a Neon Postgres database and a local SQLite file.",
	"connection-features/connection-string-mode.webp": "Seaquel Add Connection screen with a field for pasting a postgres:// connection string above buttons for PostgreSQL, MySQL, MariaDB, SQLite, DuckDB and SQL Server.",
	"connection-features/dbeaver-import.webp": "Seaquel Import DBeaver Connections dialog listing a detected neondb Postgres connection and a test.db SQLite file, noting that passwords are not imported.",
	"connection-features/duckdb-desktop-support.webp": "Seaquel Add Connection form for DuckDB with the connection name DuckDB - In-Memory, a :memory: database path, a Browse button and a Test Connection button.",
	"connection-features/duckdb-extensions.webp": "Seaquel DuckDB extensions manager listing loaded, installed and not-installed extensions such as httpfs, parquet and delta, with Load and Install & Load buttons.",
	"connection-features/multi-database.webp": "Seaquel New Connection tab offering database type choices for PostgreSQL, MySQL, MariaDB, SQLite, DuckDB and SQL Server below a connection string input.",
	"connection-features/secure-storage.webp": "Seaquel connection form with highlighted checkboxes to save both the database password and the SSH tunnel password in the system keychain.",
	"connection-features/ssh-tunnel.webp": "Seaquel connection form with Connect via SSH Tunnel enabled, showing SSH host, port 22, username, password authentication method and SSH password fields.",
	"connection-features/ssl-tls-configuration.webp": "Seaquel connection Advanced Options with the SSL Mode dropdown open, listing disable, allow, prefer and require, with require selected.",
	"connection-features/tableplus-import.webp": "Seaquel Import TablePlus Connections dialog showing one detected Neon Postgres connection selected for import, with Skip and Import buttons.",
	"connection-features/test-connection.webp": "Seaquel connection form for a neondb Postgres database after Test Connection, showing a red error that password authentication failed for user neondb_owner.",

	"dashboards/custom-dashboards.webp": "Seaquel E-Commerce Overview dashboard with KPI tiles and charts, plus an Edit Widget panel setting the Orders by Status pie chart's SQL query, chart type and slice colors.",
	"dashboards/shared-dashboards.webp": "Seaquel dashboard stored as e-commerce-overview.json in a project's .seaquel folder and opened in a code editor, showing widget definitions with their SQL queries.",
	"dashboards/version-history-visual-diff.webp": "Seaquel Comparing Versions view placing dashboard Version 3 and the current version side by side, with a Version History list and a Restore button.",

	"data-operations/advanced-copy-options.webp": "Seaquel results grid for the products table with a right-click menu offering Copy Cell Value, Copy Row as JSON, Copy Column Values, Set to NULL and Set to Default.",
	"data-operations/cell-level-editing.webp": "Seaquel results grid editing a created_at timestamp cell in place, with a calendar date picker open showing March 2026.",
	"data-operations/drag-drop-files.webp": "Seaquel window dimmed behind a dashed Drop to query overlay that accepts Parquet, CSV, JSON, Excel or DuckDB files.",
	"data-operations/full-crud-support.webp": "Seaquel products results grid with pending changes: an edited product name shown old and new, and a deleted row struck through in red.",
	"data-operations/multi-format-export.webp": "Seaquel Export menu open over a query result, offering download or copy to clipboard as CSV, JSON, SQL INSERT or Markdown.",
	"data-operations/row-actions.webp": "Seaquel products results grid with a row context menu open showing copy cell, copy row as JSON, copy column values, Set to NULL and Set to Default.",
	"data-operations/virtual-scrolling.webp": "Seaquel results for SELECT * FROM main.orders returning 800,000 rows in 17ms, with a footer showing 1,000 rows per page and page 1 of 800.",

	"data-visualization/bar-charts.webp": "Seaquel Chart tab showing a blue bar chart of total revenue by invoice status (overdue, paid, sent, draft) under the GROUP BY query that produced it.",
	"data-visualization/line-charts.webp": "Seaquel Chart tab plotting cumulative invoice revenue over time as a rising green line with shaded area, beneath a SUM() OVER window-function query.",
	"data-visualization/pie-charts.webp": "Seaquel Chart tab showing a pie chart of total sales by service, including Web Development, UI/UX Design, Consulting, Database Migration and Hosting.",
	"data-visualization/scatter-charts.webp": "Seaquel Chart tab showing a scatter plot of invoice line item quantities for each service, from a query joining invoice_line_items with items.",

	"developer-experience/auto-app-updates.webp": "Seaquel update popover announcing version 2026.4.6 (23.8 MB, released Apr 5, 2026) with Skip, Later, and Install and Relaunch buttons.",
	"developer-experience/command-palette.webp": "Seaquel command palette open over a main.orders query, listing quick actions like New Query Tab, Execute Query, Save Query, and Explain Query with shortcuts.",
	"developer-experience/custom-themes.gif": "Seaquel Themes settings showing light and dark mode theme pickers and built-in themes like Nord, Dracula, Solarized, and GitHub, demonstrating theme switching.",
	"developer-experience/keyboard-shortcuts.webp": "Seaquel Keyboard Shortcuts dialog listing general and tab management shortcuts such as ⌘K for the command palette, ⌘T for a new tab, and ⌘W to close.",
	"developer-experience/resizable-panels.webp": "Seaquel query editor and results grid for main.orders with the sidebar toggle and the draggable divider between editor and results panels highlighted.",
	"developer-experience/smart-pagination.webp": "Seaquel table view of main.orders with 800,000 rows, showing the page size dropdown (25 to 1000 rows) and page 1 of 800 pagination controls.",
	"developer-experience/tab-context-menu.webp": "Seaquel tab context menu on an All Orders query tab, offering Close, Close Others, Close Right, Close Left, Close All, Split Left, and Split Right.",
	"developer-experience/unsaved-changes-warnings.webp": "Seaquel Unsaved Changes dialog asking what to do with an edited All Orders query, with Cancel, Discard, and Save buttons.",

	"git-based-project-sharing/inline-sharing-controls.webp": "Seaquel sidebar with Git sharing icons next to the Demo DB connection and a shared All Orders query under a Shared section, both highlighted.",
	"git-based-project-sharing/per-project-git-integration.webp": "Seaquel Project Settings on the Team Sharing page, with a Git directory path, GitHub remote URL, a Sync button, and a Not synced status.",
	"git-based-project-sharing/team-collaboration.webp": "Seaquel project files, including a connection YAML and an all-orders.sql query, shown in LazyGit with an unstaged diff and a history of query commits.",

	"history-organization/favorites.webp": "Seaquel queries sidebar with a highlighted Starred section holding the All Orders and All Products saved queries, each marked with a yellow star.",
	"history-organization/full-text-search.webp": "Seaquel queries sidebar search with \"produ\" typed in, filtering the Starred list down to the All Products query.",
	"history-organization/query-history.webp": "Seaquel query History section in the sidebar listing two recent SELECT queries on main.products and main.orders with 11ms and 12ms run times.",
	"history-organization/saved-queries.webp": "Seaquel sidebar with the Local saved queries section expanded, listing the All Orders and All Products queries next to the open editor.",

	"learn-sql/interactive-tutorials.webp": "Seaquel SQL tutorial on JOINs, with a completed \"Your First JOIN\" challenge checklist, products and categories tables joined on a canvas, and generated SQL.",
	"learn-sql/practice-database.webp": "Seaquel SQL Sandbox with its practice tables highlighted (categories, products, customers, orders, order_items, reviews), ready to drag onto the canvas.",
	"learn-sql/visual-query-sandbox.webp": "Seaquel SQL Sandbox visual query builder joining the categories and products tables with an INNER join, next to the generated SQL and clause panels.",

	"pending-changes/destructive-query-protection.webp": "Seaquel Drop Table confirmation dialog warning that dropping public.invoice_line_items cannot be undone, with an empty Pending Changes panel beside it.",
	"pending-changes/staged-edits.webp": "Seaquel Pending Changes panel listing a staged row insert and an inline name edit on public.items, with Clear All and Execute All buttons.",

	"query-editor/hot-path-analysis.webp": "Seaquel Explain ANALYZE view drawing a query plan tree of Sort, Hash Join, and Seq Scan nodes, with the slowest path highlighted in red.",
	"query-editor/monaco-editor.webp": "Seaquel SQL editor autocompleting \"main.or\" with table suggestions order_items and orders from the Large Database schema.",
	"query-editor/multi-statement-execution.webp": "Seaquel editor running two SELECT statements on main.orders at once, with separate Statement 1 and Statement 2 result tabs showing rows and timings.",
	"query-editor/query-execution.webp": "Seaquel query result for SELECT * FROM main.orders, with a Statement 1 badge showing 800,000 rows in 169ms above the results table.",
	"query-editor/sample-queries.webp": "Seaquel empty query tab offering example queries, \"List all tables\" and \"Preview table data\", each with a Try It button.",
	"query-editor/sql-formatting.webp": "Seaquel editor showing a neatly formatted multi-join GROUP BY query for top-selling categories, with results for Electronics, Music, and Books.",
	"query-editor/tab-management.webp": "Seaquel tab bar with several query tabs open and the new-tab dropdown offering Query, Connection, and Dashboard options.",
	"query-editor/vim-emacs-keybindings.webp": "Seaquel Editor settings with the Keybinding Mode dropdown open, offering Default, Vim, and Emacs, with Vim selected.",

	"split-panes-navigation/deep-links.webp": "Seaquel saved-queries sidebar with a context menu open on the shared All Orders query, highlighting the Share query option beside its results.",
	"split-panes-navigation/query-version-history.webp": "Seaquel Version History panel listing three saved versions of a query, with a side-by-side diff adding a WHERE price > 50 clause.",
	"split-panes-navigation/split-panes.webp": "Seaquel editor split into two side-by-side panes, each with its own tabs and query: products on the left, orders with results on the right.",

	"statistics-dashboard/database-metrics.webp": "Seaquel stats dashboard for a Postgres database showing total size, table, index and connection counts, plus table sizes and index usage.",
	"statistics-dashboard/index-usage-monitoring.webp": "Seaquel stats dashboard with the Index Usage table highlighted, showing scan counts per index and one index flagged with an unused warning.",
	"statistics-dashboard/multi-database-statistics.webp": "Seaquel stats dashboard for a 101.58 MB SQLite database, listing row counts for six tables and scan counts for five indexes.",

	"table-management/create-tables.webp": "Seaquel Create Table form defining columns, an index and a foreign key for a products table, with a live CREATE TABLE SQL preview.",
	"table-management/inline-row-insertion.webp": "Seaquel data grid for public.items with a new row being typed inline below the existing rows, with confirm and cancel buttons.",
	"table-management/schema-editing.webp": "Seaquel schema editor for an invoices table showing column types, nullability and defaults, with a generated ALTER TABLE SQL preview.",

	"visual-query-builder/aggregate-functions.webp": "Seaquel visual query builder joining two tables on a canvas, with a SUM aggregate that appears as SUM(...) AS total_sales in the SQL panel.",
	"visual-query-builder/boolean-operators.webp": "Seaquel visual query builder with an AND/OR dropdown open between two WHERE conditions, next to the generated SQL.",
	"visual-query-builder/two-way-sql-sync.gif": "Seaquel visual query builder with a table canvas beside a SQL editor, showing edits on either side kept in sync with the other.",
	"visual-query-builder/variable-support.webp": "Seaquel visual query builder with a WHERE condition using a {{date_from}} variable, shown as a highlighted placeholder in the SQL.",

	"visual-tools/erd-viewer.webp": "Seaquel entity relationship diagram of four tables with foreign key links, and the Export menu open with PNG and SVG download or copy options.",
	"visual-tools/query-visualizer.webp": "Seaquel Visual tab showing a SQL query as a flow diagram of steps: two tables, inner join, WHERE, GROUP BY, SELECT, ORDER BY and LIMIT.",
	"visual-tools/schema-tree-browser.webp": "Seaquel schema tree sidebar with a table's context menu open (View/Edit Schema, Truncate Table, Drop Table) next to the orders data grid.",
	"visual-tools/table-inspector.webp": "Seaquel table inspector for the orders table listing column types, nullability, PK and FK keys, and a unique btree index.",
	"visual-tools/visual-query-plans.webp": "Seaquel Explain tab with ANALYZE enabled, drawing a join-and-aggregate query's execution plan as a tree of connected nodes.",
	"visual-tools/workflows.webp": "Seaquel Workflows canvas linking a customers table node to a SQL query node and a results node showing three returned rows.",
};

/** `path` is relative to `$lib/assets/features/`, e.g. `ai-assistant/mentions.webp`. */
export function screenshotAlt(path: string, fallback: string): string {
	return SCREENSHOT_ALT[path] ?? `Seaquel ${fallback} screenshot`;
}
