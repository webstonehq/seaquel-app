<script lang="ts">
	import type { FaqEntry } from "$lib/competitors";

	interface Props {
		faq: FaqEntry[];
	}

	let { faq }: Props = $props();

	// FAQPage structured data is what gets pulled into search features and AI
	// answers, so the questions are phrased the way people actually search.
	const jsonLd = $derived(
		JSON.stringify({
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: faq.map(({ q, a }) => ({
				"@type": "Question",
				name: q,
				acceptedAnswer: { "@type": "Answer", text: a },
			})),
		}),
	);
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<section>
	<h2 class="mb-6 font-bold text-2xl tracking-tight md:text-3xl">Common questions</h2>
	<div class="space-y-4">
		{#each faq as entry}
			<details class="group rounded-xl border bg-card p-5" open>
				<summary class="cursor-pointer font-semibold marker:content-none">
					{entry.q}
				</summary>
				<p class="mt-3 text-muted-foreground text-sm leading-relaxed">{entry.a}</p>
			</details>
		{/each}
	</div>
</section>
