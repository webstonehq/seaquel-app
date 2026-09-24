<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import ComparisonTable from "$lib/components/compare/comparison-table.svelte";
	import TheyWin from "$lib/components/compare/they-win.svelte";
	import CompetitorFaq from "$lib/components/compare/competitor-faq.svelte";
	import VerifiedFooter from "$lib/components/compare/verified-footer.svelte";
	import { DownloadIcon } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const c = $derived(data.competitor);
	const Content = $derived(c.content);
	// A long-tail page is about a parent product, so "vs" links point at it.
	const comparisonSlug = $derived(c.basedOn ?? c.slug);
</script>

<Seo title={c.seoTitle} description={c.altDescription ?? c.description} />

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />
	<div class="pt-16">
		<section class="border-b bg-muted/20 py-12 md:py-16">
			<div class="container mx-auto max-w-4xl px-4 md:px-6">
				<a href="/alternatives" class="text-muted-foreground text-sm hover:text-foreground">
					&larr; All alternatives
				</a>
				<h1 class="mt-4 text-balance font-bold text-4xl tracking-tight md:text-5xl">
					{c.altTitle}
				</h1>
				<p class="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
					{c.altDescription ?? c.description}
				</p>
				{#if c.angle}
					<p class="mt-4 inline-block rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 font-medium text-primary text-sm">
						{c.angle}
					</p>
				{/if}
			</div>
		</section>

		<div class="container mx-auto flex max-w-4xl flex-col gap-16 px-4 py-12 md:px-6 md:py-16">
			<!--
				Replacement intent leads with the problem, not with a feature table:
				the reader already knows the product and is looking for a reason.
			-->
			<article class="prose prose-neutral dark:prose-invert max-w-none">
				<Content />
			</article>

			<ComparisonTable competitor={c.name} rows={c.rows} verifiedOn={c.verifiedOn} />

			<TheyWin competitor={c.name} concessions={c.theyWinAt} />

			<section class="rounded-xl border bg-card p-6">
				<h2 class="mb-2 font-semibold text-lg">Try it against your own database</h2>
				<p class="mb-4 text-muted-foreground text-sm leading-relaxed">
					{#if c.importer}
						Seaquel imports {c.name}'s saved connections, so you can be looking at your own
						data in a few minutes. Passwords don't come across.
					{:else}
						Seaquel is free for personal use and you get the whole app — there's no cut-down
						tier to evaluate.
					{/if}
				</p>
				<div class="flex flex-wrap gap-3">
					<a
						href="/download"
						class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
					>
						<DownloadIcon class="size-4" />
						Download Seaquel
					</a>
					<a
						href="/compare/{comparisonSlug}"
						class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium text-sm hover:bg-muted/50"
					>
						Full Seaquel vs {c.name} comparison
					</a>
				</div>
			</section>

			<CompetitorFaq faq={c.faq} />

			<VerifiedFooter vendor={c.name} verifiedOn={c.verifiedOn} sources={c.sources} />
		</div>

		<FooterSection />
	</div>
</div>
