---
title: Charts
description: Create bar, line, pie, and scatter charts from query results.
---

Seaquel lets you turn query results into charts without leaving the app. Pick a chart type, map your columns, and visualize your data in seconds.

## Chart types

- **Bar** — compare values across categories
- **Line** — show trends over time or ordered data
- **Pie** — display proportions of a whole
- **Scatter** — reveal correlations between two numeric columns

## Creating a chart

1. Run a query that returns results.
2. Click the **Chart** tab in the results panel.
3. Choose a chart type.
4. Select columns for the X-axis and Y-axis.
5. The chart renders immediately.

## Configuration options

- **X-axis and Y-axis** — pick any column from your result set.
- **Multi-series** — group data into multiple series for side-by-side comparison.
- **Aggregate functions** — apply SUM, COUNT, AVG, and other aggregations.
- **Scope** — chart the current page of results, or all results.

## Charts on the canvas

Charts integrate directly with the [canvas](/docs/visual-tools/canvas/):

1. Add a query node and execute it to produce a result node.
2. Connect a chart node to the result node.
3. The chart updates automatically whenever the query is re-executed.

This makes it easy to build live dashboards that refresh on demand.

## When to use charts

- Quick data exploration during development
- Spotting trends and outliers without switching tools
- Building visual summaries on the canvas for team discussions
