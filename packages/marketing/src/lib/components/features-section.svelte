<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { ZapIcon, CpuIcon, WifiOffIcon, BrainCircuitIcon, DatabaseIcon, ShieldCheckIcon, ActivityIcon, NetworkIcon, LayoutDashboardIcon, GitBranchIcon, BarChart3Icon, GraduationCapIcon, UsersIcon, SparklesIcon, LayoutPanelLeftIcon, ClipboardCheckIcon, TableIcon, ChevronLeftIcon, ChevronRightIcon, WorkflowIcon } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import FullscreenOverlay from "$lib/components/fullscreen-overlay.svelte";

	const images: Record<string, { default: string }> = import.meta.glob(
		'$lib/assets/features/*/*.webp',
		{ eager: true, query: { enhanced: true } }
	);

	function getImage(path: string) {
		return images[`/src/lib/assets/features/${path}`]?.default;
	}

	interface GalleryItem {
		src: string;
		title: string;
		description: string;
		slug: string;
	}

	const heroFeatures = [
		{
			icon: SparklesIcon,
			title: "AI Assistant",
			description: "Ask questions about your data in plain English. The AI understands your schema and active query to generate SQL, create dashboards, and help you work faster — with privacy controls per connection.",
			gradient: "from-purple-500/10 to-pink-500/10",
			badge: "New in 2026.4.5",
			slug: "ai-assistant",
			screenshots: [
				"ai-assistant/natural-language-to-sql.webp",
				"ai-assistant/mentions.webp",
				"ai-assistant/dashboard-generation.webp",
				"ai-assistant/optional-by-design.webp",
				"ai-assistant/privacy-at-the-core.webp",
			],
		},
		{
			icon: LayoutPanelLeftIcon,
			title: "Dashboards",
			description: "Build custom dashboards with KPI widgets, charts, and tables powered by live queries. Share them with your team through Git-based project sharing, with full version history and visual diffs.",
			gradient: "from-sky-500/10 to-blue-500/10",
			badge: "New in 2026.4.5",
			slug: "dashboards",
			screenshots: [
				"dashboards/custom-dashboards.webp",
				"dashboards/shared-dashboards.webp",
				"dashboards/version-history-visual-diff.webp",
			],
		},
		{
			icon: ClipboardCheckIcon,
			title: "Pending Changes",
			description: "Stage data edits and review them before committing. Inserts, updates, and deletes are queued so you can review the full batch before applying — with built-in protection against destructive queries.",
			gradient: "from-amber-500/10 to-orange-500/10",
			badge: "New in 2026.4.5",
			slug: "pending-changes",
			screenshots: [
				"pending-changes/staged-edits.webp",
				"pending-changes/destructive-query-protection.webp",
			],
		},
		{
			icon: TableIcon,
			title: "Table Management",
			description: "Create tables, edit schemas, and insert rows visually across PostgreSQL, MySQL, SQLite, DuckDB, and MSSQL — no DDL required.",
			gradient: "from-emerald-500/10 to-teal-500/10",
			badge: "New in 2026.4.5",
			slug: "table-management",
			screenshots: [
				"table-management/create-tables.webp",
				"table-management/schema-editing.webp",
				"table-management/inline-row-insertion.webp",
			],
		},
		{
			icon: WorkflowIcon,
			title: "Workflows",
			description: "Build analysis workflows visually. Drag tables, write queries, view results, and create charts on an infinite canvas - all connected and auto-updating.",
			gradient: "from-indigo-500/10 to-violet-500/10",
			badge: "Signature Feature",
			slug: "visual-tools",
			screenshots: [
				"visual-tools/workflows.webp",
			],
		},
		{
			icon: ActivityIcon,
			title: "Visual Query Plans",
			description: "Stop guessing why your queries are slow. Interactive EXPLAIN diagrams show exactly where time is spent, so you can optimize with confidence.",
			gradient: "from-violet-500/10 to-purple-500/10",
			badge: "Signature Feature",
			slug: "visual-tools",
			screenshots: [
				"visual-tools/visual-query-plans.webp",
			],
		},
	];

	const features = [
		{
			icon: ZapIcon,
			title: "Lightning Fast",
			description: "Stop waiting for your database client. Seaquel launches in under 2 seconds and executes queries instantly with native Rust performance.",
			gradient: "from-yellow-500/10 to-orange-500/10",
			slug: "",
			screenshots: [],
		},
		{
			icon: CpuIcon,
			title: "Resource Efficient",
			description: "Keep your laptop fans quiet. Seaquel uses 50% less memory than DBeaver and DataGrip, leaving more resources for your actual work.",
			gradient: "from-blue-500/10 to-cyan-500/10",
			slug: "",
			screenshots: [],
		},
		{
			icon: WifiOffIcon,
			title: "Works Offline",
			description: "Query your local databases anywhere - on a plane, in a cafe, or in a secure environment. Your data never touches our servers.",
			gradient: "from-green-500/10 to-emerald-500/10",
			slug: "",
			screenshots: [],
		},
		{
			icon: BrainCircuitIcon,
			title: "AI-Powered Assistant",
			description: "Describe what you want in plain English and get working SQL. Use @-mentions for precision, generate dashboards from a description, and configure privacy per connection.",
			gradient: "from-purple-500/10 to-pink-500/10",
			slug: "ai-assistant",
			screenshots: [
				"ai-assistant/natural-language-to-sql.webp",
				"ai-assistant/mentions.webp",
				"ai-assistant/dashboard-generation.webp",
			],
		},
		{
			icon: DatabaseIcon,
			title: "Multi-Database Support",
			description: "Connect to PostgreSQL, MySQL, SQLite, and more from one beautiful interface. Even import your DBeaver connections with one click.",
			gradient: "from-indigo-500/10 to-blue-500/10",
			slug: "connection-features",
			screenshots: [
				"connection-features/multi-database.webp",
				"connection-features/dbeaver-import.webp",
			],
		},
		{
			icon: ShieldCheckIcon,
			title: "Secure by Design",
			description: "Your credentials stay on your machine, encrypted with modern standards. No accounts, no cloud sync, no telemetry. Just privacy.",
			gradient: "from-red-500/10 to-rose-500/10",
			slug: "connection-features",
			screenshots: [
				"connection-features/secure-storage.webp",
			],
		},
		{
			icon: BarChart3Icon,
			title: "Built-in Charts",
			description: "Turn query results into Bar, Line, Pie, and Scatter charts instantly. Configure axes and groupings with an intuitive UI.",
			gradient: "from-amber-500/10 to-orange-500/10",
			slug: "data-visualization",
			screenshots: [
				"data-visualization/bar-charts.webp",
				"data-visualization/line-charts.webp",
				"data-visualization/pie-charts.webp",
				"data-visualization/scatter-charts.webp",
			],
		},
	];

	// Build a flat gallery from all features for cross-feature navigation
	function buildGallery(featureLists: { title: string; description: string; slug: string; screenshots: string[] }[][]): GalleryItem[] {
		const items: GalleryItem[] = [];
		for (const list of featureLists) {
			for (const feature of list) {
				for (const path of feature.screenshots) {
					const src = getImage(path);
					if (src) items.push({ src, title: feature.title, description: feature.description, slug: feature.slug });
				}
			}
		}
		return items;
	}

	const gallery = buildGallery([heroFeatures, features]);

	let fullscreenOpen = $state(false);
	let fullscreenIndex = $state(0);

	let current = $derived(gallery[fullscreenIndex]);
	let hasPrev = $derived(fullscreenIndex > 0);
	let hasNext = $derived(fullscreenIndex < gallery.length - 1);

	function openFullscreen(src: string) {
		const idx = gallery.findIndex((item) => item.src === src);
		if (idx === -1) return;
		fullscreenIndex = idx;
		fullscreenOpen = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!fullscreenOpen) return;
		if (event.key === 'ArrowLeft' && hasPrev) fullscreenIndex--;
		if (event.key === 'ArrowRight' && hasNext) fullscreenIndex++;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<section id="features" class="py-20 md:py-32 bg-linear-to-b from-background to-muted/20">
	<div class="container mx-auto px-4 md:px-6">
		<!-- Section header -->
		<div class="text-center flex flex-col gap-4 mb-16">
			<h2 class="text-3xl md:text-5xl font-bold tracking-tight">
				Built for
				<span class="text-primary">Real Database Work</span>
			</h2>
			<p class="text-lg text-muted-foreground max-w-2xl mx-auto">Professional tools without the bloat. Everything you need to query, explore, and manage your databases efficiently.</p>
		</div>

		<!-- Hero features - Visual Tools (Priority) -->
		<div class="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
			{#each heroFeatures as feature, index}
				<div in:fly={{ y: 30, delay: 100 + index * 100, duration: 600 }}>
					<a href="/features/{feature.slug}" class="block h-full no-underline">
						<Card class="h-full border-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 bg-linear-to-br {feature.gradient}">
							<CardHeader class="pb-2">
								<div class="flex items-center justify-between mb-4">
									<div class="size-14 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
										<feature.icon class="size-7 text-primary" />
									</div>
									{#if feature.badge}
										<span class="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
											{feature.badge}
										</span>
									{/if}
								</div>
								<CardTitle class="text-2xl">{feature.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription class="text-base leading-relaxed">
									{feature.description}
								</CardDescription>
								{#if feature.screenshots.length > 0}
									<div class="flex gap-2 mt-4 flex-wrap">
										{#each feature.screenshots as screenshot, i}
											{@const src = getImage(screenshot)}
											{#if src}
												<button
													class="cursor-pointer border-0 bg-transparent p-0 rounded-lg overflow-hidden ring-1 ring-border hover:ring-primary/50 transition-all duration-200 hover:scale-105"
													onclick={(e) => { e.preventDefault(); e.stopPropagation(); openFullscreen(src); }}
													aria-label="View screenshot fullscreen"
												>
													<enhanced:img
														src={src}
														alt={feature.title}
														class="h-16 w-auto object-cover"
													/>
												</button>
											{/if}
										{/each}
									</div>
								{/if}
							</CardContent>
						</Card>
					</a>
				</div>
			{/each}
		</div>

		<!-- Core features grid -->
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
			{#each features as feature, index}
				<div in:fly={{ y: 30, delay: 300 + index * 100, duration: 600 }}>
					<a href={feature.slug ? `/features/${feature.slug}` : '/features'} class="block h-full no-underline">
						<Card class="h-full border-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] bg-linear-to-br {feature.gradient}">
							<CardHeader>
								<div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 ring-2 ring-primary/20">
									<feature.icon class="size-6 text-primary" />
								</div>
								<CardTitle class="text-xl">{feature.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription class="text-base leading-relaxed">
									{feature.description}
								</CardDescription>
								{#if feature.screenshots.length > 0}
									<div class="flex gap-2 mt-4 flex-wrap">
										{#each feature.screenshots as screenshot, i}
											{@const src = getImage(screenshot)}
											{#if src}
												<button
													class="cursor-pointer border-0 bg-transparent p-0 rounded-lg overflow-hidden ring-1 ring-border hover:ring-primary/50 transition-all duration-200 hover:scale-105"
													onclick={(e) => { e.preventDefault(); e.stopPropagation(); openFullscreen(src); }}
													aria-label="View screenshot fullscreen"
												>
													<enhanced:img
														src={src}
														alt={feature.title}
														class="h-16 w-auto object-cover"
													/>
												</button>
											{/if}
										{/each}
									</div>
								{/if}
							</CardContent>
						</Card>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<FullscreenOverlay bind:open={fullscreenOpen}>
	{#if current}
		<div class="relative w-full h-full flex flex-col">
			<!-- Screenshot -->
			<div class="relative flex-1 min-h-0">
				<enhanced:img
					src={current.src}
					alt={current.title}
					class="w-full h-full object-contain"
				/>

				{#if hasPrev}
					<button
						class="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-black/80 transition-all duration-200 cursor-pointer"
						onclick={() => fullscreenIndex--}
						aria-label="Previous screenshot"
					>
						<ChevronLeftIcon class="size-5" />
					</button>
				{/if}
				{#if hasNext}
					<button
						class="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-black/80 transition-all duration-200 cursor-pointer"
						onclick={() => fullscreenIndex++}
						aria-label="Next screenshot"
					>
						<ChevronRightIcon class="size-5" />
					</button>
				{/if}
			</div>

			<!-- Feature info bar -->
			<div class="flex items-center gap-4 px-5 py-3 bg-muted/80 backdrop-blur-sm border-t border-border">
				<div class="flex-1 min-w-0">
					{#if current.slug}
						<a href="/features/{current.slug}" class="text-sm font-semibold text-foreground hover:text-primary truncate block transition-colors">{current.title}</a>
					{:else}
						<p class="text-sm font-semibold text-foreground truncate">{current.title}</p>
					{/if}
					<p class="text-xs text-muted-foreground truncate">{current.description}</p>
				</div>
				<span class="text-xs text-muted-foreground whitespace-nowrap">{fullscreenIndex + 1} / {gallery.length}</span>
			</div>
		</div>
	{/if}
</FullscreenOverlay>
