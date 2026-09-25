<script lang="ts">
	import type { Competitor } from "$lib/competitors";

	interface Props {
		competitor: Competitor;
	}

	let { competitor }: Props = $props();

	// Seaquel's own side of the table. Kept here rather than in each content
	// file so a change to our pricing or engine list updates every page at once.
	const SEAQUEL = {
		pricing: "Free for personal use",
		commercial: "Annual Individual or Business license",
		license: "MIT source; official builds need a license for work",
		engines: 6,
		runtime: "Tauri (Rust + WebView)",
	};

	const platformLabel: Record<string, string> = {
		full: "Full",
		trails: "Trails the flagship build",
		none: "Not supported",
	};

	const facts = $derived([
		{ label: "Free tier", seaquel: SEAQUEL.pricing, them: competitor.pricing.free },
		{ label: "Paid", seaquel: SEAQUEL.commercial, them: competitor.pricing.summary },
		{ label: "License", seaquel: SEAQUEL.license, them: competitor.license },
		{
			label: "Engines",
			seaquel: String(SEAQUEL.engines),
			them: `~${competitor.engineCount}`,
		},
		{
			label: "Linux",
			seaquel: platformLabel.full,
			them: platformLabel[competitor.platforms.linux],
		},
	]);
</script>

<section class="overflow-hidden rounded-xl border bg-card">
	<div class="grid grid-cols-[1fr_1fr_1fr] border-b bg-muted/50 text-sm">
		<div class="p-3 font-semibold">At a glance</div>
		<div class="border-x p-3 font-semibold text-primary">Seaquel</div>
		<div class="p-3 font-semibold">{competitor.name}</div>
	</div>
	{#each facts as fact}
		<div class="grid grid-cols-[1fr_1fr_1fr] border-b text-sm last:border-b-0">
			<div class="p-3 text-muted-foreground">{fact.label}</div>
			<div class="border-x p-3 font-medium">{fact.seaquel}</div>
			<div class="p-3">{fact.them}</div>
		</div>
	{/each}
</section>
