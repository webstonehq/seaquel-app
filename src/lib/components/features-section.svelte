<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { ZapIcon, CpuIcon, WifiOffIcon, BrainCircuitIcon, DatabaseIcon, ShieldCheckIcon, ActivityIcon, NetworkIcon, LayoutDashboardIcon, GitBranchIcon, BarChart3Icon } from "lucide-svelte";
	import { fly } from "svelte/transition";

	const heroFeatures = [
		{
			icon: LayoutDashboardIcon,
			title: "Canvas Workspace",
			description: "Build analysis workflows visually. Drag tables, write queries, view results, and create charts on an infinite canvas - all connected and auto-updating.",
			gradient: "from-indigo-500/10 to-violet-500/10",
			badge: "New in 2026.3",
		},
		{
			icon: GitBranchIcon,
			title: "Query Visualizer",
			description: "See your SQL as visual diagrams. Understand JOINs, WHERE clauses, and SELECT columns at a glance with automatic AST parsing.",
			gradient: "from-emerald-500/10 to-teal-500/10",
			badge: "New in 2026.3",
		},
		{
			icon: ActivityIcon,
			title: "Visual Query Plans",
			description: "Stop guessing why your queries are slow. Interactive EXPLAIN diagrams show exactly where time is spent, so you can optimize with confidence.",
			gradient: "from-violet-500/10 to-purple-500/10",
			badge: "Signature Feature",
		},
		{
			icon: NetworkIcon,
			title: "ERD Viewer",
			description: "Understand any database schema in seconds. Explore relationships visually, search tables instantly, and export diagrams for documentation.",
			gradient: "from-teal-500/10 to-cyan-500/10",
			badge: "Signature Feature",
		},
	];

	const features = [
		{
			icon: ZapIcon,
			title: "Lightning Fast",
			description: "Stop waiting for your database client. Seaquel launches in under 2 seconds and executes queries instantly with native Rust performance.",
			gradient: "from-yellow-500/10 to-orange-500/10",
		},
		{
			icon: CpuIcon,
			title: "Resource Efficient",
			description: "Keep your laptop fans quiet. Seaquel uses 50% less memory than DBeaver and DataGrip, leaving more resources for your actual work.",
			gradient: "from-blue-500/10 to-cyan-500/10",
		},
		{
			icon: WifiOffIcon,
			title: "Works Offline",
			description: "Query your local databases anywhere - on a plane, in a cafe, or in a secure environment. Your data never touches our servers.",
			gradient: "from-green-500/10 to-emerald-500/10",
		},
		{
			icon: BrainCircuitIcon,
			title: "AI-Powered Assistant",
			description: "Describe what you want in plain English and get working SQL. Let AI help you write complex JOINs and optimize slow queries.",
			gradient: "from-purple-500/10 to-pink-500/10",
		},
		{
			icon: DatabaseIcon,
			title: "Multi-Database Support",
			description: "Connect to PostgreSQL, MySQL, SQLite, and more from one beautiful interface. Even import your DBeaver connections with one click.",
			gradient: "from-indigo-500/10 to-blue-500/10",
		},
		{
			icon: ShieldCheckIcon,
			title: "Secure by Design",
			description: "Your credentials stay on your machine, encrypted with modern standards. No accounts, no cloud sync, no telemetry. Just privacy.",
			gradient: "from-red-500/10 to-rose-500/10",
		},
		{
			icon: BarChart3Icon,
			title: "Built-in Charts",
			description: "Turn query results into Bar, Line, Pie, and Scatter charts instantly. Configure axes and groupings with an intuitive UI.",
			gradient: "from-amber-500/10 to-orange-500/10",
		},
	];
</script>

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
						</CardContent>
					</Card>
				</div>
			{/each}
		</div>

		<!-- Core features grid -->
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
			{#each features as feature, index}
				<div in:fly={{ y: 30, delay: 300 + index * 100, duration: 600 }}>
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
						</CardContent>
					</Card>
				</div>
			{/each}
		</div>
	</div>
</section>
