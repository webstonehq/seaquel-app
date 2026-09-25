---
name: Azure Data Studio
vendor: Microsoft
verifiedOn: "2026-09-25"
seoTitle: "Seaquel vs Azure Data Studio — after the retirement (2026) | Seaquel"
description: "A sourced comparison of Seaquel and Azure Data Studio, which Microsoft retired on 28 February 2026: what ADS did, what Seaquel can and can't replace, and when VS Code is the better move."
altTitle: "Azure Data Studio alternative"
altDescription: "Microsoft retired Azure Data Studio in February 2026. Here's what replaces it on macOS and Linux, including the parts of SQL Server work Seaquel doesn't handle yet."
angle: "Retired 28 February 2026 — no updates or security fixes since"
license: "Free; source on GitHub, repository archived"
engineCount: 4
engines:
  [
    "SQL Server",
    "Azure SQL",
    "PostgreSQL (extension)",
    "MySQL (extension)",
    "Azure Cosmos DB (extension)",
  ]
platforms:
  macos: full
  windows: full
  linux: full
pricing:
  model: free
  summary: "Free, but retired on 28 February 2026"
  free: "Everything, with no updates or security fixes since retirement"
sources:
  retirement: https://learn.microsoft.com/en-us/sql/tools/whats-happening-azure-data-studio
  announcement: https://devblogs.microsoft.com/azure-sql/azure-data-studio-retirement/
  repository: https://github.com/microsoft/azuredatastudio
  overview: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  kerberos: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/enable-kerberos
  notebooks: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/notebooks/notebooks-guidance
  go: https://learn.microsoft.com/en-us/sql/t-sql/language-elements/sql-server-utilities-statements-go
  mssql: https://learn.microsoft.com/en-us/sql/tools/visual-studio-code-extensions/mssql/mssql-extension-visual-studio-code
  migration: https://devblogs.microsoft.com/azure-sql/azure-data-studio-is-retired-move-your-azure-sql-workflow-to-vs-code-in-10-minutes/
  ssms: https://learn.microsoft.com/en-us/ssms/system-requirements
chooseSeaquel:
  - "You want a standalone desktop app on macOS or Linux, not an editor with an extension on top."
  - "SQL Server is one of several databases you use. PostgreSQL, MySQL, MariaDB, SQLite and DuckDB are built in, with no extensions to find."
  - "You connect with SQL logins, your scripts don't depend on GO, and you mostly write queries and read results."
  - "You want an ERD viewer, dashboards and a workflow canvas in the same app."
chooseThem:
  - "You need Windows authentication or Microsoft Entra ID. Seaquel connects with SQL logins only. ADS's successor, VS Code with the MSSQL extension, supports both."
  - "Your scripts use GO batch separators. Seaquel doesn't split on GO yet."
  - "You relied on notebooks, schema compare, DACPAC deployment or the profiler. The MSSQL extension carries all of them forward, and Seaquel has none."
  - "You browse and edit stored procedures and functions. Seaquel's object tree shows schemas, tables and views only."
  - "You want your connections, groups and key bindings to come across in one step. The MSSQL extension ships an ADS migration toolkit, and Seaquel can't read ADS connections."
rows:
  - feature: "Still maintained"
    seaquel: true
    them: false
    note: "No updates or security fixes since 28 February 2026. The GitHub repository was archived the same day."
    source: https://learn.microsoft.com/en-us/sql/tools/whats-happening-azure-data-studio
  - feature: "Price"
    seaquel: "Free for personal use; annual license for commercial use"
    them: "Free"
    note: "Its official successor, VS Code with the MSSQL extension, is also free."
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  - feature: "Runs on macOS and Linux"
    seaquel: true
    them: true
    note: "SSMS, Microsoft's other desktop tool for SQL Server, runs on Windows only."
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  - feature: "SQL Server login"
    seaquel: true
    them: true
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  - feature: "Windows authentication (Kerberos on macOS and Linux)"
    seaquel: false
    them: true
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/enable-kerberos
  - feature: "Microsoft Entra ID sign-in"
    seaquel: false
    them: true
    note: "If your Azure SQL database only accepts Entra ID logins, Seaquel can't connect to it."
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  - feature: "GO batch separator in scripts"
    seaquel: false
    them: true
    note: "A script saved from ADS that relies on GO needs editing before it runs in Seaquel."
    source: https://learn.microsoft.com/en-us/sql/t-sql/language-elements/sql-server-utilities-statements-go
  - feature: "Browse stored procedures and functions"
    seaquel: false
    them: true
    note: "Seaquel's SQL Server object tree covers schemas, tables and views. EXEC still runs as a normal query."
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  - feature: "Multiple result sets from one batch"
    seaquel: "First result set only"
    them: true
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  - feature: "Graphical execution plans"
    seaquel: true
    them: true
    note: "Seaquel reads SQL Server's estimated and actual XML plans."
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  - feature: "Charts from query results"
    seaquel: "Dashboards"
    them: "Chart viewer and insight widgets"
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  - feature: "Notebooks"
    seaquel: false
    them: "Jupyter, with SQL and Python kernels"
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/notebooks/notebooks-guidance
  - feature: "Schema compare and DACPAC"
    seaquel: false
    them: true
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  - feature: "ERD viewer"
    seaquel: true
    them: false
    note: "Microsoft lists database diagrams as an SSMS-only feature."
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
  - feature: "Other engines"
    seaquel: "PostgreSQL, MySQL, MariaDB, SQLite, DuckDB built in"
    them: "PostgreSQL and MySQL via extensions"
    note: "After the retirement these became separate VS Code extensions. As of September 2026 Microsoft still lists the MySQL one as pending."
    source: https://learn.microsoft.com/en-us/sql/tools/whats-happening-azure-data-studio
  - feature: "Runtime"
    seaquel: "Rust and WebView (Tauri)"
    them: "Electron (a VS Code fork) with the .NET SQL Tools Service"
    source: https://learn.microsoft.com/en-us/previous-versions/azure-data-studio/what-is-azure-data-studio
theyWinAt:
  - title: "It was built for SQL Server, and Seaquel wasn't"
    body: "ADS ran on Microsoft's own SQL Tools Service and SqlClient driver, so Windows authentication, Kerberos on a Mac, Entra ID, GO separators and multiple result sets all just worked. Seaquel talks to SQL Server over a general-purpose driver with SQL logins only, and those gaps show up quickly if SQL Server is your whole job."
  - title: "Its successor is free, maintained and good"
    body: "VS Code with the MSSQL extension carries forward query plans, notebooks, schema compare, DACPAC, the profiler, backup and restore, a table designer and flat-file import. It runs on Windows, macOS and Linux and costs nothing. For most people leaving ADS, it's the obvious next step."
  - title: "Your setup comes across in one step"
    body: "The MSSQL extension ships an ADS migration toolkit that brings over saved connections, connection groups, settings and key bindings. Seaquel can't read ADS connections at all, so you'd be entering each server again by hand."
  - title: "Notebooks"
    body: "ADS notebooks were plain .ipynb files mixing T-SQL, Markdown and Python. They open in VS Code's SQL notebooks. Seaquel has no notebook support, so a runbook written as a notebook has nowhere to go here."
  - title: "Database projects and deployment"
    body: "Schema compare, SQL database projects and DACPAC or BACPAC import and export are how many teams move SQL Server schemas between environments. All of it carries over to VS Code, and Seaquel doesn't attempt any of it."
faq:
  - q: "When was Azure Data Studio retired?"
    a: "Microsoft announced the retirement on 6 February 2025, and it took effect on 28 February 2026. Since then ADS has had no updates, security patches or maintenance, and the GitHub repository is archived and read-only."
  - q: "Does Azure Data Studio still work?"
    a: "An existing install still opens and connects. It just won't be patched again. On a work machine, running an unpatched database client with saved production credentials is the part to worry about, not whether it launches."
  - q: "What does Microsoft recommend instead?"
    a: "Visual Studio Code with the MSSQL extension, for day-to-day SQL work on Windows, macOS and Linux. For SQL Server Agent jobs and deeper administration it points to SSMS, which runs on Windows only."
  - q: "Can Seaquel import my Azure Data Studio connections?"
    a: "No. Seaquel imports saved connections from TablePlus and DBeaver, but not from ADS. You'll need to add your servers again. The MSSQL extension for VS Code can import them directly."
  - q: "Can Seaquel connect to Azure SQL Database?"
    a: "Yes, with a SQL login over an encrypted connection. It can't sign in with Microsoft Entra ID, so a database configured for Entra-only authentication is out of reach for now."
  - q: "Should I use Seaquel instead of Azure Data Studio?"
    a: "If SQL Server is most of your work and you rely on Windows auth, Entra ID, GO scripts or notebooks, use VS Code with the MSSQL extension. Seaquel makes sense if SQL Server is one engine among several, you use SQL logins, and you'd rather have a standalone app than an editor with extensions."
---

Azure Data Studio was retired on **28 February 2026**. Microsoft announced it a
year earlier, and since the cutoff ADS hasn't had an update or a security fix.
The GitHub repository was archived the same day.

If you're on Windows you have SSMS. On a Mac or Linux you don't, because SSMS
is still Windows-only. That's the gap ADS filled, and the reason this page
exists.

## Try Microsoft's replacement first

Microsoft points ADS users to Visual Studio Code with the MSSQL extension, and
it's better than a lot of posts about the retirement suggest. Query plans,
notebooks, schema compare, DACPAC, a profiler, backup and restore, a table
designer, Copilot. There's also a migration toolkit that brings your
connections, groups and key bindings across. It's free, and it runs on all
three platforms.

If SQL Server is your whole job, start there. I'd rather tell you that than
have you find out a week in.

## What Seaquel doesn't do for SQL Server yet

These are the gaps you'd hit coming from ADS, as of the date at the bottom of
this page:

- **SQL logins only.** No Windows authentication, no Kerberos, no Entra ID.
- **No GO.** Scripts that use it as a batch separator need splitting by hand.
- **Tables and views only** in the object tree. Stored procedures and functions
  aren't listed, though `EXEC` runs like any other query.
- **One result set per batch.** If a procedure returns three, you see the first.
- **No notebooks, schema compare or DACPAC.**
- **No ADS importer.** You add your servers again.

If any of those is part of your normal day, Seaquel isn't the replacement.

## Where Seaquel fits

ADS was also a general database client for a lot of people. SQL Server at work,
Postgres for a side project, SQLite somewhere in between, all in one app with a
couple of extensions. That's the part VS Code doesn't really rebuild. Each engine
is now its own extension, and as of September 2026 Microsoft still lists the
MySQL one as pending.

Seaquel is a standalone desktop app with SQL Server, PostgreSQL, MySQL, MariaDB,
SQLite and DuckDB built in. It reads SQL Server's execution plans, has an ERD
viewer and dashboards, and builds macOS, Windows and Linux from the same
release. The source is MIT.

If you connect with SQL logins, your scripts don't lean on GO, and SQL Server is
one of several databases you use, it's worth a try. Otherwise use VS Code.
