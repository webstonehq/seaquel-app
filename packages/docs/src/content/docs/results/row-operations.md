---
title: Row Operations
description: Insert, update, and delete rows with intuitive dialogs.
---

Seaquel provides full CRUD support directly from the result grid.

## Insert a row

1. Click the **Insert Row** button above the result grid.
2. A form dialog opens with fields for each column.
3. Fill in the values and confirm.
4. Seaquel generates and executes an INSERT statement.

## Update a row

Edit values directly in the grid by clicking a cell, or select a row and open the edit dialog for a form-based view of all columns. See [Editing Data](/results/editing-data/) for details on inline editing.

## Delete a row

1. Select the row you want to remove.
2. Click **Delete Row**.
3. A confirmation dialog appears showing the row data.
4. Confirm to execute the DELETE statement.

## Safety

All destructive operations show a confirmation dialog before executing, so you won't accidentally lose data. Each operation generates standard SQL (INSERT, UPDATE, DELETE) that runs against your database directly.
