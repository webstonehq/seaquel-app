<script lang="ts">
	import { CheckIcon, XIcon, MinusIcon } from "lucide-svelte";
	import { fly } from "svelte/transition";

	type FeatureValue = boolean | string;

	interface ComparisonRow {
		feature: string;
		seaquel: FeatureValue;
		others: FeatureValue;
	}

	const features: ComparisonRow[] = [
		{ feature: "Memory Usage", seaquel: "~200MB", others: "500MB - 1GB" },
		{ feature: "Startup Time", seaquel: "<2 seconds", others: "5-15 seconds" },
		{ feature: "Interactive SQL Tutorials", seaquel: true, others: false },
		{ feature: "Visual Query Builder", seaquel: true, others: false },
		{ feature: "Shared Query Library", seaquel: true, others: "Paid only" },
		{ feature: "Visual Query Plans", seaquel: true, others: "Paid only" },
		{ feature: "ERD Viewer", seaquel: true, others: "Paid only" },
		{ feature: "Canvas Workspace", seaquel: true, others: false },
		{ feature: "Built-in Charts", seaquel: true, others: "Paid only" },
		{ feature: "AI SQL Assistant", seaquel: true, others: "Limited" },
		{ feature: "Windows, macOS & Linux", seaquel: true, others: true },
		{ feature: "Works Fully Offline", seaquel: true, others: "Partial" },
		{ feature: "100% Open Source", seaquel: true, others: "Partial" },
		{ feature: "Native Performance", seaquel: true, others: false },
		{ feature: "Price", seaquel: "Free forever", others: "$0 - $229/year" },
	];
</script>

<section class="py-20 md:py-32 bg-muted/20">
	<div class="container mx-auto px-4 md:px-6">
		<div class="text-center mb-12" in:fly={{ y: 20, duration: 600 }}>
			<h2 class="text-3xl md:text-4xl font-bold tracking-tight mb-4">
				Why Developers <span class="text-primary">Switch to Seaquel</span>
			</h2>
			<p class="text-lg text-muted-foreground max-w-2xl mx-auto">
				See how Seaquel compares to traditional database clients like DBeaver and DataGrip
			</p>
		</div>

		<div class="max-w-4xl mx-auto" in:fly={{ y: 30, delay: 200, duration: 600 }}>
			<div class="rounded-xl border-2 border-primary/20 overflow-hidden bg-card shadow-lg">
				<!-- Header -->
				<div class="grid grid-cols-3 bg-muted/50 border-b">
					<div class="p-4 font-semibold">Feature</div>
					<div class="p-4 font-semibold text-center bg-primary/10 border-x border-primary/20">
						<span class="text-primary">Seaquel</span>
					</div>
					<div class="p-4 font-semibold text-center text-muted-foreground">Others</div>
				</div>

				<!-- Rows -->
				{#each features as row, index}
					<div
						class="grid grid-cols-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors"
						in:fly={{ y: 10, delay: 300 + index * 50, duration: 400 }}
					>
						<div class="p-4 flex items-center text-sm md:text-base">{row.feature}</div>
						<div class="p-4 flex items-center justify-center bg-primary/5 border-x border-primary/10">
							{#if typeof row.seaquel === "boolean"}
								{#if row.seaquel}
									<CheckIcon class="size-5 text-green-500" />
								{:else}
									<XIcon class="size-5 text-red-500" />
								{/if}
							{:else}
								<span class="font-medium text-primary text-sm md:text-base">{row.seaquel}</span>
							{/if}
						</div>
						<div class="p-4 flex items-center justify-center text-muted-foreground text-sm md:text-base">
							{#if typeof row.others === "boolean"}
								{#if row.others}
									<CheckIcon class="size-5 text-green-500" />
								{:else}
									<XIcon class="size-5 text-red-500" />
								{/if}
							{:else}
								<span>{row.others}</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<p class="text-center text-sm text-muted-foreground mt-6">
				Comparison based on DBeaver Community/Pro and JetBrains DataGrip as of 2025
			</p>
		</div>
	</div>
</section>
