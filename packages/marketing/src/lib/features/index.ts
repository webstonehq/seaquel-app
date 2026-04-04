import type { Component, ComponentType, SvelteComponent } from 'svelte';
import {
	ActivityIcon,
	NetworkIcon,
	CodeIcon,
	WandSparklesIcon,
	LayoutGridIcon,
	PlayIcon,
	DatabaseIcon,
	PencilIcon,
	RowsIcon,
	DownloadIcon,
	HistoryIcon,
	BookmarkIcon,
	StarIcon,
	SearchIcon,
	ShieldIcon,
	LockIcon,
	KeyboardIcon,
	PaletteIcon,
	ChevronsLeftRightIcon,
	TerminalIcon,
	FolderTreeIcon,
	TablePropertiesIcon,
	ListOrderedIcon,
	CopyIcon,
	GaugeIcon,
	LinkIcon,
	ShieldCheckIcon,
	CommandIcon,
	MousePointerClickIcon,
	TriangleAlertIcon,
	RefreshCwIcon,
	GlobeIcon,
	FileCodeIcon,
	PlugIcon,
	ImportIcon,
	LayoutDashboardIcon,
	GitBranchIcon,
	BarChart3Icon,
	LineChartIcon,
	PieChartIcon,
	ScatterChartIcon,
	TrendingUpIcon,
	FlameIcon,
	HardDriveIcon,
	GraduationCapIcon,
	BookOpenIcon,
	BoxesIcon,
	UsersIcon,
	GitForkIcon,
	FolderGit2Icon,
	SlidersHorizontalIcon,
	BracesIcon,
	ToggleLeftIcon,
	ArrowLeftRightIcon,
	AsteriskIcon,
	FunctionSquareIcon,
	MonitorIcon,
	SparklesIcon,
	AtSignIcon,
	LayoutPanelLeftIcon,
	ShareIcon,
	DiffIcon,
	SplitIcon,
	ExternalLinkIcon,
	ShieldAlertIcon,
	ToggleRightIcon,
	FolderInputIcon,
	ClipboardCheckIcon,
	TableIcon,
	PlusCircleIcon,
	Columns3Icon,
	ShieldBanIcon
} from 'lucide-svelte';

export interface Feature {
	icon: Component<any> | ComponentType<SvelteComponent<any>>;
	title: string;
	description: string;
	extendedDescription: string;
	screenshot?: string;
}

export interface FeatureCategory {
	slug: string;
	icon: Component<any> | ComponentType<SvelteComponent<any>>;
	title: string;
	description: string;
	features: Feature[];
	variant?: 'default' | 'highlight';
}

export const featureCategories: FeatureCategory[] = [
	{
		slug: 'visual-tools',
		icon: LayoutDashboardIcon,
		title: 'Visual Tools',
		description:
			'Understand your database like never before with interactive visual tools.',
		variant: 'highlight',
		features: [
			{
				icon: LayoutDashboardIcon,
				title: 'Canvas Workspace',
				description:
					'An infinite visual canvas powered by XYFlow. Drag tables to inspect data, write SQL in query nodes, view results, and create charts - all connected in a visual workflow.',
				extendedDescription:
					'The Canvas Workspace is an infinite, zoomable surface where you can drag tables from the sidebar to instantly inspect their data, place SQL query nodes to write and execute queries, and wire the results into chart nodes for immediate visualization. Every element is connected — change a query and the downstream chart updates automatically. It turns your database exploration into a visual, spatial workflow instead of a linear series of tabs.'
			},
			{
				icon: GitBranchIcon,
				title: 'Query Visualizer',
				description:
					'SQL queries parsed into visual diagrams showing table relationships, JOINs, WHERE clauses, and SELECT projections. Access via the Visualize tab in the editor.',
				extendedDescription:
					'The Query Visualizer parses your SQL and renders it as an interactive diagram. Tables appear as nodes, JOINs as labeled edges, and WHERE clauses and SELECT projections are displayed alongside the relevant tables. It helps you understand complex multi-join queries at a glance and is available in the Visualize tab of every query editor.'
			},
			{
				icon: ActivityIcon,
				title: 'Visual Query Plans',
				description:
					'Interactive EXPLAIN and EXPLAIN ANALYZE diagrams powered by SvelteFlow. See planning time, execution time, and estimated rows at a glance.',
				extendedDescription:
					'Run EXPLAIN or EXPLAIN ANALYZE on any query and see the execution plan rendered as an interactive, zoomable diagram. Each node shows its operation type, estimated rows, and actual execution time. Edges represent data flow between operations. Planning time, execution time, and total row estimates are displayed at a glance, making it easy to spot bottlenecks and optimize slow queries.'
			},
			{
				icon: NetworkIcon,
				title: 'ERD Viewer',
				description:
					'Interactive Entity Relationship Diagrams with table search, schema filtering, and one-click export to PNG, SVG, or clipboard.',
				extendedDescription:
					'The ERD Viewer generates interactive Entity Relationship Diagrams from your database schema. Tables are displayed with their columns, primary keys, and foreign key relationships as connecting lines. Use the search bar to find specific tables, filter by schema, zoom and pan to navigate large schemas, and export the diagram as PNG, SVG, or directly to your clipboard.'
			},
			{
				icon: FolderTreeIcon,
				title: 'Schema Tree Browser',
				description:
					'Navigate your database with collapsible schema groups. See row counts, distinguish tables from views, and quickly generate SELECT queries from any table.',
				extendedDescription:
					'The Schema Tree Browser presents your database structure as a collapsible tree in the sidebar. Schemas, tables, and views are organized hierarchically with icons to distinguish them. Each table shows its approximate row count, and you can right-click any table to instantly generate a SELECT query or open it in the Table Inspector.'
			},
			{
				icon: TablePropertiesIcon,
				title: 'Table Inspector',
				description:
					'Detailed column information with primary key and foreign key badges. View index information and constraints at a glance.',
				extendedDescription:
					'The Table Inspector gives you a detailed breakdown of any table\'s structure. Each column is listed with its data type, nullability, default value, and badges for primary keys and foreign keys. A separate panel shows all indexes on the table with their columns and uniqueness. Constraints are listed with their type and definition, giving you a complete picture of the table\'s schema at a glance.'
			}
		]
	},
	{
		slug: 'ai-assistant',
		icon: SparklesIcon,
		title: 'AI Assistant',
		description:
			'Get AI-powered help writing SQL, generating dashboards, and exploring your data — with privacy you control.',
		features: [
			{
				icon: SparklesIcon,
				title: 'Natural Language to SQL',
				description:
					'Ask questions about your data in plain English and get SQL queries generated in context. The assistant understands your schema, connections, and active query.',
				extendedDescription:
					'Type a question in plain English — like "show me the top 10 customers by revenue this quarter" — and the AI assistant generates the corresponding SQL query. It understands your database schema, the currently active connection, and the query you\'re working on, so the results are contextual and ready to execute.'
			},
			{
				icon: AtSignIcon,
				title: '@-Mentions',
				description:
					'Reference tables, columns, and connections directly in the AI prompt input for more precise and targeted results.',
				extendedDescription:
					'Use @-mentions in the AI prompt input to reference specific tables, columns, or connections. Type @ followed by a table name and the assistant autocompletes it, ensuring the AI has the exact context it needs to generate accurate queries. This makes prompts more precise and reduces ambiguity in complex schemas.'
			},
			{
				icon: LayoutPanelLeftIcon,
				title: 'Dashboard Generation',
				description:
					'The AI assistant can create and update dashboards on your behalf, turning a description into a fully configured layout of widgets and queries.',
				extendedDescription:
					'Describe the dashboard you want — "create a dashboard showing daily signups, revenue by product, and a table of recent orders" — and the AI assistant builds it for you. It generates the queries, picks appropriate chart types, and arranges the widgets in a sensible layout. You can then refine it manually or ask the AI to make adjustments.'
			},
			{
				icon: ToggleRightIcon,
				title: 'Optional by Design',
				description:
					'AI features can be disabled entirely from the settings panel if you prefer a traditional workflow.',
				extendedDescription:
					'Every AI feature in Seaquel is optional. If you prefer a traditional database client workflow, you can disable all AI functionality from the settings panel with a single toggle. The rest of the application works exactly the same without it — no degraded experience, no nagging prompts.'
			},
			{
				icon: ShieldAlertIcon,
				title: 'Privacy At The Core',
				description:
					'AI privacy settings can be configured globally and overridden for each connection, so you stay in control of what data is shared.',
				extendedDescription:
					'AI privacy settings give you granular control over what data is sent to the AI provider. Configure a global policy and override it per connection — for example, allow AI on your development database but disable it for production. Schema metadata sharing, query content sharing, and result sharing are each independently configurable.'
			}
		]
	},
	{
		slug: 'dashboards',
		icon: LayoutPanelLeftIcon,
		title: 'Dashboards',
		description:
			'Build, share, and version custom dashboards powered by live database queries.',
		variant: 'highlight',
		features: [
			{
				icon: LayoutPanelLeftIcon,
				title: 'Custom Dashboards',
				description:
					'Create dashboards with KPI widgets, charts, and tables powered by live queries against your connected databases. Add, resize, and delete widgets to build the view you need.',
				extendedDescription:
					'Build custom dashboards with a drag-and-drop grid layout. Add KPI widgets that display a single metric, chart widgets (bar, line, pie, scatter) powered by SQL queries, and table widgets that show live query results. Each widget is independently resizable, and you can connect different widgets to different databases within the same dashboard.'
			},
			{
				icon: ShareIcon,
				title: 'Shared Dashboards',
				description:
					'Share dashboards with your team through Git-based project sharing, just like queries and connections.',
				extendedDescription:
					'Dashboards are stored as part of your project and can be shared with your team through Git-based project sharing. When you share a dashboard, your teammates get the full layout, widget configuration, and queries. Credentials remain local — only the dashboard definition is shared.'
			},
			{
				icon: DiffIcon,
				title: 'Version History & Visual Diff',
				description:
					'Browse previous versions of a dashboard and see exactly what changed with a side-by-side visual diff.',
				extendedDescription:
					'Every change to a dashboard is versioned. Browse the full history of a dashboard and see exactly what changed between any two versions with a side-by-side visual diff. The diff highlights added, removed, and modified widgets, making it easy to understand what changed and when.'
			}
		]
	},
	{
		slug: 'split-panes-navigation',
		icon: SplitIcon,
		title: 'Split Panes & Navigation',
		description:
			'Work on multiple things at once, link directly to resources, and track changes over time.',
		features: [
			{
				icon: SplitIcon,
				title: 'Split Panes',
				description:
					'Split the editor area to view and work on multiple queries, results, or dashboards side by side.',
				extendedDescription:
					'Split your workspace horizontally or vertically to view multiple queries, results, dashboards, or any combination side by side. Each pane is fully independent — you can execute a query in one pane while reviewing results in another. Drag the divider to resize panes to your preferred proportions.'
			},
			{
				icon: ExternalLinkIcon,
				title: 'Deep Links',
				description:
					'Open projects, connections, queries, and dashboards from a URL. Share direct links to specific resources with your team.',
				extendedDescription:
					'Every resource in Seaquel has a unique URL. Share a link to a specific query, dashboard, or connection and your teammate opens it directly in their Seaquel instance. Deep links work across machines when the resource is part of a shared Git project.'
			},
			{
				icon: DiffIcon,
				title: 'Query Version History',
				description:
					'View the history of changes to any query with a visual diff, making it easy to understand what changed and when.',
				extendedDescription:
					'Every saved query maintains a version history. Browse previous versions and view a side-by-side diff showing exactly what changed in the SQL. Restore any previous version with one click, so you never lose a working query after an experimental edit.'
			},
			{
				icon: FolderInputIcon,
				title: 'Project Import',
				description:
					'Import projects from other Seaquel installations to quickly get set up on a new machine.',
				extendedDescription:
					'Moving to a new machine? Export your entire project — connections, queries, dashboards, and settings — and import it into a fresh Seaquel installation. The import wizard handles everything, letting you get back to work in seconds.'
			}
		]
	},
	{
		slug: 'pending-changes',
		icon: ClipboardCheckIcon,
		title: 'Pending Changes',
		description:
			'Stage data edits and review them before committing, with built-in protection against destructive queries.',
		variant: 'highlight',
		features: [
			{
				icon: ClipboardCheckIcon,
				title: 'Staged Edits',
				description:
					'Data edits (inserts, updates, deletes) are staged as pending changes instead of executing immediately. Review all queued modifications before applying them.',
				extendedDescription:
					'When you edit cells, insert rows, or delete records, changes are queued as pending modifications instead of hitting the database immediately. A dedicated panel shows every staged change with a human-readable description. Review the full batch, discard individual changes, or apply them all at once — giving you a safety net for bulk data work.'
			},
			{
				icon: ShieldBanIcon,
				title: 'Destructive Query Protection',
				description:
					'Running DROP, DELETE, TRUNCATE, or ALTER queries triggers a confirmation dialog to prevent accidental data loss.',
				extendedDescription:
					'Seaquel detects destructive SQL statements — DROP, DELETE, TRUNCATE, and ALTER — and presents a confirmation dialog before executing them. The dialog shows the exact statement that will run, so you can double-check before committing to an irreversible operation. This catches accidental executions and provides a last line of defense against data loss.'
			}
		]
	},
	{
		slug: 'table-management',
		icon: TableIcon,
		title: 'Table Management',
		description:
			'Create tables, edit schemas, and insert rows visually — across PostgreSQL, MySQL, SQLite, DuckDB, and MSSQL.',
		features: [
			{
				icon: PlusCircleIcon,
				title: 'Create Tables',
				description:
					'Design and create new tables with a visual form. Define columns, types, constraints, and primary keys without writing DDL.',
				extendedDescription:
					'Create new tables directly in the app with a visual form builder. Add columns, pick data types from a database-specific list, set nullability and default values, and designate primary keys — all without writing a single line of DDL. The generated CREATE TABLE statement is previewed before execution so you can verify it.'
			},
			{
				icon: Columns3Icon,
				title: 'Schema Editing',
				description:
					'Add, rename, or drop columns on existing tables across all supported database engines.',
				extendedDescription:
					'Modify existing table schemas through a visual interface. Add new columns with type and constraint configuration, rename columns, or drop columns you no longer need. Seaquel generates the appropriate ALTER TABLE statements for each database engine — PostgreSQL, MySQL, SQLite, DuckDB, and MSSQL — handling syntax differences automatically.'
			},
			{
				icon: RowsIcon,
				title: 'Inline Row Insertion',
				description:
					'Add rows to tables with a form-based UX that respects column types, constraints, and default values.',
				extendedDescription:
					'Insert new rows through an improved form dialog that adapts to your table schema. Each field is typed according to its column — text inputs for strings, number fields for integers, date pickers for timestamps. Required fields are clearly marked, default values are pre-filled, and validation runs before submission to catch errors early.'
			}
		]
	},
	{
		slug: 'learn-sql',
		icon: GraduationCapIcon,
		title: 'Learn SQL',
		description:
			'Master SQL interactively with built-in tutorials, challenges, and a visual query builder sandbox.',
		variant: 'highlight',
		features: [
			{
				icon: GraduationCapIcon,
				title: 'Interactive Tutorials',
				description:
					'Structured lessons covering SELECT, WHERE, JOINs, aggregates, and more. Each lesson includes progressive challenges that validate your queries in real time.',
				extendedDescription:
					'Learn SQL through structured, interactive lessons that cover everything from basic SELECT statements to complex JOINs and aggregates. Each lesson presents a concept, shows examples, and then gives you progressive challenges. Your queries are validated in real time against expected results, so you get immediate feedback on whether your solution is correct.'
			},
			{
				icon: BoxesIcon,
				title: 'Visual Query Sandbox',
				description:
					'A drag-and-drop canvas where you build queries visually by placing table nodes, connecting JOINs, and configuring filters — with live SQL generation.',
				extendedDescription:
					'The Visual Query Sandbox is a canvas-based environment where you build queries by dragging table nodes, drawing JOIN connections between columns, and configuring WHERE filters through a visual interface. As you build, the corresponding SQL is generated in real time in a side panel. It\'s the fastest way to understand how SQL maps to relational concepts.'
			},
			{
				icon: BookOpenIcon,
				title: 'Practice Database',
				description:
					'A built-in e-commerce sample database so you can start learning immediately without setting up your own data.',
				extendedDescription:
					'Seaquel includes a built-in e-commerce sample database with customers, orders, products, and reviews tables. It\'s pre-loaded and ready to query, so you can start learning SQL immediately without setting up a database server or importing data. The sample data is realistic and large enough to demonstrate meaningful query patterns.'
			}
		]
	},
	{
		slug: 'git-based-project-sharing',
		icon: GitForkIcon,
		title: 'Git-Based Project Sharing',
		description:
			'Collaborate with your team through per-project Git integration.',
		features: [
			{
				icon: GitForkIcon,
				title: 'Per-Project Git Integration',
				description:
					'Link a project to a Git directory containing a .seaquel/ structure to share connections, queries, and dashboards with your team.',
				extendedDescription:
					'Link any Seaquel project to a Git repository that contains a .seaquel/ directory. Connections, queries, and dashboards stored in this directory are version-controlled alongside your application code. Your team can clone the repo and instantly have the same database tooling set up.'
			},
			{
				icon: FolderGit2Icon,
				title: 'Inline Sharing Controls',
				description:
					'Share or unshare connections and queries directly from the sidebar. Credentials are stored locally while shared resources sync through Git.',
				extendedDescription:
					'Share or unshare any connection or query directly from the sidebar with a single click. When you share a connection, only the configuration (host, port, database name) is written to the Git-tracked .seaquel/ directory. Credentials (passwords, SSH keys) are always stored locally and never committed to Git.'
			},
			{
				icon: UsersIcon,
				title: 'Team Collaboration',
				description:
					'Build a shared library of queries and dashboards your whole team can rely on. Review, update, and version control your SQL together.',
				extendedDescription:
					'Build a shared library of queries and dashboards that your entire team can access. Because everything lives in Git, you can use pull requests to review SQL changes, track who modified what through commit history, and resolve conflicts when two people edit the same query. It brings the same collaboration workflow developers use for code to database tooling.'
			}
		]
	},
	{
		slug: 'visual-query-builder',
		icon: FunctionSquareIcon,
		title: 'Visual Query Builder',
		description:
			'Build queries visually with aggregates, variables, boolean operators, and two-way SQL sync.',
		variant: 'highlight',
		features: [
			{
				icon: FunctionSquareIcon,
				title: 'Aggregate Functions',
				description:
					'Add COUNT, SUM, AVG, MIN, and MAX aggregates per column from the filter panel or directly on table nodes in the canvas.',
				extendedDescription:
					'Add aggregate functions — COUNT, SUM, AVG, MIN, MAX — to any column directly from the filter panel or by clicking a column on a canvas table node. The query builder automatically generates the correct GROUP BY clause and updates the SQL in real time. Stack multiple aggregates on different columns to build complex analytical queries visually.'
			},
			{
				icon: BracesIcon,
				title: 'Variable Support',
				description:
					'Use {{variables}} in WHERE filter values and LIMIT inputs for reusable, parameterized queries.',
				extendedDescription:
					'Use {{variable_name}} syntax in WHERE filter values and LIMIT inputs to create parameterized, reusable queries. When you execute a query with variables, Seaquel prompts you to fill in the values. Save parameterized queries and share them with your team so anyone can run them with different inputs.'
			},
			{
				icon: ToggleLeftIcon,
				title: 'Boolean Operators',
				description:
					'Toggle between AND/OR operators in WHERE clauses for more expressive filter conditions.',
				extendedDescription:
					'Toggle between AND and OR operators in your WHERE clauses with a single click. The visual query builder displays each condition as a row, and you can switch the combining operator between them. Nest conditions to build complex filter logic without writing SQL by hand.'
			},
			{
				icon: AsteriskIcon,
				title: 'SELECT * Expansion',
				description:
					'Expand wildcard selects into explicit column lists with one click for precise control over your output.',
				extendedDescription:
					'Click the expand button next to a SELECT * and Seaquel replaces it with an explicit list of all columns in the table. This gives you precise control over which columns appear in your results and in what order — just uncheck the columns you don\'t need.'
			},
			{
				icon: ArrowLeftRightIcon,
				title: 'Two-Way SQL Sync',
				description:
					'Edit SQL directly or use the visual builder — changes sync both ways in real time so you never lose context.',
				extendedDescription:
					'Edit SQL directly in the editor or use the visual builder — changes sync both ways in real time. Add a JOIN in the visual builder and the SQL updates instantly. Edit the WHERE clause in SQL and the filter panel reflects the change. You never lose context switching between visual and text-based editing.'
			},
			{
				icon: SlidersHorizontalIcon,
				title: 'Pluggable Execution',
				description:
					'A unified query editor architecture with pluggable execution backends, powering both the main workspace and the tutorial sandbox.',
				extendedDescription:
					'The query editor uses a pluggable execution architecture. The same editor powers the main workspace (executing against your connected databases) and the tutorial sandbox (executing against the built-in practice database). This unified architecture means every feature — formatting, autocomplete, visualization — works identically everywhere.'
			}
		]
	},
	{
		slug: 'data-visualization',
		icon: BarChart3Icon,
		title: 'Data Visualization',
		description: 'Transform your query results into meaningful charts.',
		variant: 'highlight',
		features: [
			{
				icon: BarChart3Icon,
				title: 'Bar Charts',
				description:
					'Create bar charts from query results with configurable axes and groupings.',
				extendedDescription:
					'Create bar charts from any query result set. Select which columns to use for the X axis, Y axis, and optional grouping. Bar charts support horizontal and vertical orientations, stacked and grouped modes, and automatically handle categorical and numerical data.'
			},
			{
				icon: LineChartIcon,
				title: 'Line Charts',
				description:
					'Visualize trends over time. Auto-updates when connected to query results on the canvas.',
				extendedDescription:
					'Visualize trends over time with line charts. Select a date or timestamp column for the X axis and one or more numerical columns for the Y axis. When placed on the canvas and connected to a query node, line charts auto-update whenever the query results change.'
			},
			{
				icon: PieChartIcon,
				title: 'Pie Charts',
				description:
					'Display proportional data with configurable segments and labels.',
				extendedDescription:
					'Display proportional data as pie charts with configurable segments and labels. Select a categorical column for segments and a numerical column for values. Pie charts automatically calculate percentages and display labels with both the category name and its proportion.'
			},
			{
				icon: ScatterChartIcon,
				title: 'Scatter Charts',
				description:
					'Plot relationships between variables and identify correlations visually.',
				extendedDescription:
					'Plot relationships between two numerical variables with scatter charts. Each row in your query result becomes a point on the chart. Use an optional grouping column to color-code points by category, making it easy to spot correlations and clusters in your data.'
			}
		]
	},
	{
		slug: 'statistics-dashboard',
		icon: GaugeIcon,
		title: 'Statistics Dashboard',
		description:
			'Monitor your database health and performance at a glance.',
		features: [
			{
				icon: GaugeIcon,
				title: 'Database Metrics',
				description:
					'View database size, table counts, and total row counts at a glance.',
				extendedDescription:
					'The Statistics Dashboard displays key database metrics at a glance: total database size, number of tables, total row count across all tables, and index count. Metrics update when you refresh, giving you a quick health check of your database without writing any queries.'
			},
			{
				icon: TrendingUpIcon,
				title: 'Index Usage Monitoring',
				description:
					'Monitor index utilization to identify optimization opportunities.',
				extendedDescription:
					'Monitor how effectively your indexes are being used. The Statistics Dashboard shows index scan counts, tuple reads, and usage ratios for each index. Identify unused indexes that waste disk space and missing indexes that could speed up slow queries.'
			},
			{
				icon: DatabaseIcon,
				title: 'Multi-Database Statistics',
				description:
					'Statistics available for both DuckDB and PostgreSQL connections.',
				extendedDescription:
					'The Statistics Dashboard works with both DuckDB and PostgreSQL connections. Each database engine reports its own set of metrics through a unified interface, so you get consistent monitoring regardless of which database you\'re connected to.'
			}
		]
	},
	{
		slug: 'query-editor',
		icon: CodeIcon,
		title: 'Query Editor',
		description:
			'A powerful, professional-grade SQL editor with all the features you\'d expect.',
		variant: 'highlight',
		features: [
			{
				icon: CodeIcon,
				title: 'Monaco Editor',
				description:
					'Professional code editor with SQL syntax highlighting, autocomplete, and intelligent error detection.',
				extendedDescription:
					'Seaquel\'s query editor is powered by Monaco — the same editor engine behind VS Code. You get SQL syntax highlighting, intelligent autocomplete that suggests table names, column names, and SQL keywords based on your schema, and real-time error detection that underlines problems before you execute.'
			},
			{
				icon: WandSparklesIcon,
				title: 'SQL Formatting',
				description:
					'One-click SQL formatting with configurable style, proper indentation, and uppercase keywords.',
				extendedDescription:
					'Format any SQL query with a single click or keyboard shortcut (Cmd+Shift+F). The formatter applies consistent indentation, uppercases SQL keywords, and aligns clauses for readability. Formatting style is configurable to match your team\'s conventions.'
			},
			{
				icon: LayoutGridIcon,
				title: 'Tab Management',
				description:
					'Multiple query tabs with Cmd+T to create, Cmd+W to close, and Cmd+1-9 to quickly switch between tabs.',
				extendedDescription:
					'Work on multiple queries simultaneously with tabbed editing. Create new tabs with Cmd+T, close them with Cmd+W, and switch between them with Cmd+1 through Cmd+9. Tabs persist across sessions, and each tab maintains its own query, results, connection, and scroll position.'
			},
			{
				icon: PlayIcon,
				title: 'Query Execution',
				description:
					'Execute queries with Cmd+Enter. See execution time, row counts, and affected row indicators instantly.',
				extendedDescription:
					'Execute any query with Cmd+Enter and see results instantly. The status bar shows execution time, row count, and affected row indicators. For long-running queries, a progress indicator shows that the query is still executing, and you can cancel it at any time.'
			},
			{
				icon: ListOrderedIcon,
				title: 'Multi-Statement Execution',
				description:
					'Execute multiple SQL statements at once with live statement count. Results are displayed separately for each statement.',
				extendedDescription:
					'Write multiple SQL statements separated by semicolons and execute them all at once. Seaquel shows a live statement count as it processes each one, and results are displayed in separate tabs — one for each statement. Errors in one statement don\'t prevent the others from executing.'
			},
			{
				icon: FileCodeIcon,
				title: 'Sample Queries',
				description:
					'Get started quickly with pre-populated sample queries for each database type. Learn SQL patterns and explore your schema instantly.',
				extendedDescription:
					'Every new connection comes with a set of sample queries tailored to its database type. PostgreSQL connections include queries for listing tables, checking index usage, and viewing active queries. DuckDB connections include examples for CSV import, Parquet reading, and analytical functions. Use them as starting points to explore your schema.'
			},
			{
				icon: FlameIcon,
				title: 'Hot Path Analysis',
				description:
					'Automatic bottleneck detection highlights expensive operations with severity indicators (green, yellow, red).',
				extendedDescription:
					'When viewing query execution plans, Seaquel automatically detects expensive operations and highlights them with severity indicators — green for fast, yellow for moderate, and red for slow. The hot path is traced through the plan so you can immediately see which operations are consuming the most time.'
			}
		]
	},
	{
		slug: 'data-operations',
		icon: DatabaseIcon,
		title: 'Data Operations',
		description:
			'Full control over your data with intuitive editing and export capabilities.',
		features: [
			{
				icon: DatabaseIcon,
				title: 'Full CRUD Support',
				description:
					'INSERT, UPDATE, and DELETE operations directly from the interface with intuitive dialogs and confirmations.',
				extendedDescription:
					'Perform INSERT, UPDATE, and DELETE operations directly from the results grid without writing SQL. Add new rows through a form dialog that respects column types and constraints. Edit existing values inline. Delete rows with a confirmation step. Seaquel generates the SQL behind the scenes so you can review it before committing.'
			},
			{
				icon: PencilIcon,
				title: 'Cell-Level Editing',
				description:
					'Click any cell to edit values inline. Seaquel automatically generates the UPDATE statement for you.',
				extendedDescription:
					'Click any cell in the results grid to edit its value inline. Seaquel detects the column type and presents an appropriate editor — text input for strings, number input for integers, date picker for timestamps. When you save, it generates and executes the UPDATE statement automatically, targeting the correct row by primary key.'
			},
			{
				icon: RowsIcon,
				title: 'Row Actions',
				description:
					'Add new rows with form dialogs, delete rows with confirmation, and manage your data efficiently.',
				extendedDescription:
					'Right-click any row to access row actions: duplicate the row, delete it (with confirmation), or copy it as JSON. Use the "Add Row" button to insert new records through a form dialog that pre-fills default values and validates required fields before submission.'
			},
			{
				icon: DownloadIcon,
				title: 'Multi-Format Export',
				description:
					'Export query results to CSV, JSON, SQL INSERT statements, or Markdown tables with one click.',
				extendedDescription:
					'Export your query results in multiple formats with one click. Choose from CSV (with configurable delimiter), JSON (array of objects or array of arrays), SQL INSERT statements (ready to run on another database), or Markdown tables (perfect for documentation and README files).'
			},
			{
				icon: CopyIcon,
				title: 'Advanced Copy Options',
				description:
					'Copy individual rows as JSON, copy entire column values to clipboard. Multiple formats for seamless data transfer.',
				extendedDescription:
					'Copy data in the format you need. Select a single row and copy it as a JSON object. Select a column header and copy all values in that column. Copy a range of cells as tab-separated values for pasting into spreadsheets. Each copy operation respects the data type and formats values appropriately.'
			},
			{
				icon: GaugeIcon,
				title: 'Virtual Scrolling',
				description:
					'Efficiently render thousands of rows without performance degradation. Smooth scrolling through massive result sets.',
				extendedDescription:
					'The results grid uses virtual scrolling to efficiently handle result sets of any size. Only the visible rows are rendered in the DOM, so scrolling through 100,000 rows is just as smooth as scrolling through 100. Column widths auto-size to fit content, and you can manually resize them by dragging the header borders.'
			}
		]
	},
	{
		slug: 'history-organization',
		icon: HistoryIcon,
		title: 'History & Organization',
		description:
			'Keep track of your queries and stay organized with powerful search.',
		variant: 'highlight',
		features: [
			{
				icon: HistoryIcon,
				title: 'Query History',
				description:
					'Up to 500 queries stored with timestamps, execution time, and row counts for each query.',
				extendedDescription:
					'Every query you execute is saved to your local history — up to 500 entries per connection. Each entry records the SQL text, timestamp, execution time, row count, and which connection it was run against. Browse your history in the sidebar, re-execute any past query with one click, or copy it to a new tab for modification.'
			},
			{
				icon: BookmarkIcon,
				title: 'Saved Queries',
				description:
					'Save frequently used queries with custom names. Access them anytime from the sidebar.',
				extendedDescription:
					'Save any query with a custom name and optional description for easy retrieval. Saved queries appear in the sidebar organized by project and connection. Open a saved query in a new tab, or drag it onto the canvas as a query node. Saved queries can be shared with your team through Git-based project sharing.'
			},
			{
				icon: StarIcon,
				title: 'Favorites',
				description:
					'Star important queries for quick access. Filter by favorites to find what you need fast.',
				extendedDescription:
					'Star your most important queries to pin them to the top of the sidebar. Favorites work across history and saved queries — star a frequently-run report or a query you\'re actively debugging. Filter the sidebar to show only favorites when you need to cut through the noise.'
			},
			{
				icon: SearchIcon,
				title: 'Full-Text Search',
				description:
					'Search across your query history and saved queries to find exactly what you\'re looking for.',
				extendedDescription:
					'Search across all your queries — history, saved, and favorites — with full-text search. Type a table name, keyword, or SQL fragment and results appear instantly. Search matches against the SQL text, query name, and description, so you can find what you need no matter how you remember it.'
			}
		]
	},
	{
		slug: 'connection-features',
		icon: PlugIcon,
		title: 'Connection Features',
		description:
			'Connect securely to your databases with flexible authentication options.',
		features: [
			{
				icon: TerminalIcon,
				title: 'SSH Tunnel',
				description:
					'Connect securely through SSH tunnels for remote databases. Supports password and key-based authentication.',
				extendedDescription:
					'Connect to databases behind firewalls through SSH tunnels. Configure the SSH host, port, username, and authentication method (password or private key). Seaquel establishes the tunnel automatically when you connect and tears it down when you disconnect. Supports jump hosts for multi-hop configurations.'
			},
			{
				icon: DatabaseIcon,
				title: 'Multi-Database',
				description:
					'PostgreSQL, MySQL, MariaDB, SQLite, DuckDB, and SQL Server support with a unified interface.',
				extendedDescription:
					'Seaquel supports PostgreSQL, MySQL, MariaDB, SQLite, DuckDB, and SQL Server through a unified interface. Switch between databases without changing your workflow — the query editor, results grid, schema browser, and all other tools work consistently across all supported database engines.'
			},
			{
				icon: LockIcon,
				title: 'Secure Storage',
				description:
					'Connection credentials stored securely on your device. Your sensitive data never leaves your machine.',
				extendedDescription:
					'All connection credentials — passwords, SSH keys, certificates — are stored securely on your local device. Seaquel never sends credentials to any external server. When sharing connections through Git, only the non-sensitive configuration (host, port, database name) is included; credentials must be entered locally by each team member.'
			},
			{
				icon: ShieldIcon,
				title: 'Connection Persistence',
				description:
					'Saved connections persist across app restarts. Pick up right where you left off.',
				extendedDescription:
					'Your connections are saved locally and persist across app restarts. When you open Seaquel, your recent connections are ready to use — just click to reconnect. The app remembers which connections were active in your last session so you can pick up right where you left off.'
			},
			{
				icon: LinkIcon,
				title: 'Connection String Mode',
				description:
					'Two ways to connect: paste a connection string for quick setup, or use the detailed configuration form.',
				extendedDescription:
					'Connect to your database in two ways: paste a connection string (like postgres://user:pass@host:5432/db) for instant setup, or use the detailed configuration form to set each parameter individually. The form and connection string stay in sync — edit one and the other updates automatically.'
			},
			{
				icon: ShieldCheckIcon,
				title: 'SSL/TLS Configuration',
				description:
					'Flexible SSL modes: disable, allow, prefer, or require. Secure your database connections with proper encryption.',
				extendedDescription:
					'Configure SSL/TLS for each connection with granular control. Choose from disable, allow, prefer, require, or verify-full modes. Upload custom CA certificates, client certificates, and client keys for mutual TLS authentication. The connection test verifies SSL configuration before you save.'
			},
			{
				icon: PlugIcon,
				title: 'Test Connection',
				description:
					'Verify your connection settings before saving. Quickly diagnose connectivity issues with detailed error feedback.',
				extendedDescription:
					'Test your connection settings before saving with one click. The test verifies network connectivity, authentication, SSL configuration, and database access. If something fails, you get a detailed error message explaining what went wrong — not a generic "connection failed" — so you can diagnose and fix the issue quickly.'
			},
			{
				icon: ImportIcon,
				title: 'DBeaver Import',
				description:
					'Migrate from DBeaver effortlessly. Bulk import your existing connection configurations with one click.',
				extendedDescription:
					'Switching from DBeaver? Import all your connection configurations in bulk with one click. Seaquel reads DBeaver\'s connection export format and creates matching connections for each entry. Review the import preview, deselect any connections you don\'t need, and import the rest.'
			},
			{
				icon: HardDriveIcon,
				title: 'DuckDB Desktop Support',
				description:
					'Full support for DuckDB connections in the desktop app. Fast, embedded analytics at your fingertips.',
				extendedDescription:
					'Connect to DuckDB databases directly in the desktop app. Open .duckdb files from disk or create new in-memory databases for quick analysis. DuckDB connections support all Seaquel features — query editing, visualization, export, and the canvas workspace — with the blazing-fast performance DuckDB is known for.'
			}
		]
	},
	{
		slug: 'developer-experience',
		icon: KeyboardIcon,
		title: 'Developer Experience',
		description:
			'Built for developers who value efficiency and customization.',
		variant: 'highlight',
		features: [
			{
				icon: KeyboardIcon,
				title: 'Keyboard Shortcuts',
				description:
					'Comprehensive shortcuts: Cmd+Enter to execute, Cmd+S to save, Cmd+Shift+F to format, and more.',
				extendedDescription:
					'Seaquel is built for keyboard-first workflows. Execute queries with Cmd+Enter, save with Cmd+S, format SQL with Cmd+Shift+F, open the command palette with Cmd+K, and switch tabs with Cmd+1-9. Every action has a keyboard shortcut, and you can view the full shortcut reference from the command palette.'
			},
			{
				icon: PaletteIcon,
				title: 'Custom Themes',
				description:
					'Choose from preset themes like Nord, or create your own. Import and export themes, with full light and dark mode support.',
				extendedDescription:
					'Customize Seaquel\'s appearance with built-in themes like Nord, Dracula, and Solarized, or create your own. Themes control the editor colors, UI chrome, and syntax highlighting. Import themes from JSON files and export yours to share with teammates. Every theme supports both light and dark mode variants.'
			},
			{
				icon: ChevronsLeftRightIcon,
				title: 'Smart Pagination',
				description:
					'Navigate large result sets with configurable page sizes from 25 to 1000 rows per page.',
				extendedDescription:
					'Navigate large result sets with pagination controls at the bottom of the results grid. Configure page sizes from 25 to 1,000 rows per page. Jump to any page directly, or use next/previous buttons. The current page and total row count are always visible in the status bar.'
			},
			{
				icon: LayoutGridIcon,
				title: 'Resizable Panels',
				description:
					'Customize your workspace with resizable sidebar and result panels to fit your workflow.',
				extendedDescription:
					'Drag panel borders to resize the sidebar, editor, and results panels to your preferred proportions. Collapse the sidebar entirely for a full-width editor, or expand the results panel to inspect wide tables. Panel sizes persist across sessions so your workspace is always set up the way you like it.'
			},
			{
				icon: CommandIcon,
				title: 'Command Palette',
				description:
					'Quick access with Cmd+K to execute commands, navigate tabs, switch connections, and more. Power user efficiency.',
				extendedDescription:
					'Open the command palette with Cmd+K to access every action in Seaquel. Search by name to execute commands, switch between tabs, change connections, toggle settings, and navigate to any resource. The palette shows keyboard shortcuts next to each action so you can learn them over time.'
			},
			{
				icon: MousePointerClickIcon,
				title: 'Tab Context Menu',
				description:
					'Right-click tabs for quick actions: close other tabs, close tabs to the right or left, close all tabs at once.',
				extendedDescription:
					'Right-click any tab to access context actions: close the tab, close all other tabs, close tabs to the right, close tabs to the left, or close all tabs. You can also duplicate a tab to create a copy of the current query, or pin a tab to prevent it from being accidentally closed.'
			},
			{
				icon: TriangleAlertIcon,
				title: 'Unsaved Changes Warnings',
				description:
					'Never lose your work. Seaquel warns you when closing tabs with unsaved modifications.',
				extendedDescription:
					'Seaquel tracks unsaved changes in every tab and warns you before closing a tab with modifications. The tab title shows a dot indicator when there are unsaved changes. If you try to close the app with unsaved tabs, you get a confirmation dialog listing all modified queries so you can save or discard them.'
			},
			{
				icon: RefreshCwIcon,
				title: 'Auto App Updates',
				description:
					'Automatic update detection and one-click installation. Always stay on the latest version effortlessly.',
				extendedDescription:
					'Seaquel checks for updates automatically in the background. When a new version is available, you see a notification with the release notes. Click "Update" to download and install — the app restarts with the new version in seconds. You can also check for updates manually from the settings panel.'
			}
		]
	}
];

export function getFeatureCategory(slug: string): FeatureCategory | undefined {
	return featureCategories.find((c) => c.slug === slug);
}

export function getFeatureSlugs(): string[] {
	return featureCategories.map((c) => c.slug);
}

export function getAdjacentCategories(slug: string): {
	prev: { slug: string; title: string } | null;
	next: { slug: string; title: string } | null;
} {
	const index = featureCategories.findIndex((c) => c.slug === slug);
	return {
		prev:
			index > 0
				? { slug: featureCategories[index - 1].slug, title: featureCategories[index - 1].title }
				: null,
		next:
			index < featureCategories.length - 1
				? { slug: featureCategories[index + 1].slug, title: featureCategories[index + 1].title }
				: null
	};
}
