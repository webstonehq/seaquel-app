<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { ZapIcon, CpuIcon, WifiOffIcon, BrainCircuitIcon, DatabaseIcon, ShieldCheckIcon, ActivityIcon, NetworkIcon } from "lucide-svelte";
	import { fly } from "svelte/transition";

	const heroFeatures = [
		{
			icon: ActivityIcon,
			title: "Visual Query Plans",
			description: "Understand query performance with interactive EXPLAIN and EXPLAIN ANALYZE diagrams. See planning time, execution time, and drill into each operation node to optimize your queries.",
			gradient: "from-violet-500/10 to-purple-500/10",
		},
		{
			icon: NetworkIcon,
			title: "ERD Viewer",
			description: "Explore your database schema visually with interactive Entity Relationship Diagrams. Search tables, filter by schema, and export to PNG, SVG, or copy to clipboard.",
			gradient: "from-teal-500/10 to-cyan-500/10",
		},
	];

	const features = [
		{
			icon: ZapIcon,
			title: "Lightning Fast",
			description: "Built with Tauri for native performance. Execute queries and navigate your databases at incredible speeds with minimal latency.",
			gradient: "from-yellow-500/10 to-orange-500/10",
		},
		{
			icon: CpuIcon,
			title: "Resource Efficient",
			description: "Uses 50% less memory than Electron-based alternatives. Your system resources stay free for what matters most.",
			gradient: "from-blue-500/10 to-cyan-500/10",
		},
		{
			icon: WifiOffIcon,
			title: "Works Offline",
			description: "Full functionality for local databases without internet. Your data stays private and accessible anywhere, anytime.",
			gradient: "from-green-500/10 to-emerald-500/10",
		},
		{
			icon: BrainCircuitIcon,
			title: "AI-Powered Assistant",
			description: "Ask questions about your data in plain English. Get intelligent suggestions and let AI help write and optimize your SQL queries.",
			gradient: "from-purple-500/10 to-pink-500/10",
		},
		{
			icon: DatabaseIcon,
			title: "Multi-Database Support",
			description: "Connect to PostgreSQL, MySQL, SQLite, and more. Manage all your databases from one beautiful, unified interface.",
			gradient: "from-indigo-500/10 to-blue-500/10",
		},
		{
			icon: ShieldCheckIcon,
			title: "Secure by Design",
			description: "Your credentials stay local. Built with security-first principles using Rust and modern encryption standards.",
			gradient: "from-red-500/10 to-rose-500/10",
		},
	];
</script>

<section id="features" class="py-20 md:py-32 bg-linear-to-b from-background to-muted/20">
	<div class="container mx-auto px-4 md:px-6">
		<!-- Section header -->
		<div class="text-center flex flex-col gap-4 mb-16">
			<h2 class="text-3xl md:text-5xl font-bold tracking-tight">
				Everything You Need,
				<span class="text-primary">Nothing You Don't</span>
			</h2>
			<p class="text-lg text-muted-foreground max-w-2xl mx-auto">Seaquel combines cutting-edge technology with intuitive design to deliver the ultimate database management experience.</p>
		</div>

		<!-- Hero features - Visual Tools (Priority) -->
		<div class="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
			{#each heroFeatures as feature, index}
				<div in:fly={{ y: 30, delay: 100 + index * 100, duration: 600 }}>
					<Card class="h-full border-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 bg-linear-to-br {feature.gradient}">
						<CardHeader class="pb-2">
							<div class="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 ring-2 ring-primary/20">
								<feature.icon class="size-7 text-primary" />
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
					<Card class="h-full border-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 bg-linear-to-br {feature.gradient}">
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
