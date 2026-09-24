<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import VerdictBox from "$lib/components/compare/verdict-box.svelte";
	import FactsGrid from "$lib/components/compare/facts-grid.svelte";
	import ComparisonTable from "$lib/components/compare/comparison-table.svelte";
	import TheyWin from "$lib/components/compare/they-win.svelte";
	import CompetitorFaq from "$lib/components/compare/competitor-faq.svelte";
	import VerifiedFooter from "$lib/components/compare/verified-footer.svelte";
	import { ArrowRightIcon, DownloadIcon } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const c = $derived(data.competitor);
	const Content = $derived(c.content);
</script>

<Seo title={c.seoTitle} description={c.description} />

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />
	<div class="pt-16">
		<section class="border-b bg-muted/20 py-12 md:py-16">
			<div class="container mx-auto max-w-4xl px-4 md:px-6">
				<a href="/compare" class="text-muted-foreground text-sm hover:text-foreground">
					&larr; All comparisons
				</a>
				<h1 class="mt-4 text-balance font-bold text-4xl tracking-tight md:text-5xl">
					Seaquel vs {c.name}
				</h1>
				<p class="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
					{c.description}
				</p>
			</div>
		</section>

		<div class="container mx-auto flex max-w-4xl flex-col gap-16 px-4 py-12 md:px-6 md:py-16">
			<VerdictBox
				competitor={c.name}
				chooseSeaquel={c.chooseSeaquel}
				chooseThem={c.chooseThem}
			/>

			<FactsGrid competitor={c} />

			<!-- The prose body of the markdown file. -->
			<article class="prose prose-neutral dark:prose-invert max-w-none">
				<Content />
			</article>

			<ComparisonTable competitor={c.name} rows={c.rows} verifiedOn={c.verifiedOn} />

			<TheyWin competitor={c.name} concessions={c.theyWinAt} />

			<!--
				Performance rows are deliberately absent until I have measured both
				tools myself and can publish the method. See
				scripts/benchmark-clients.md.
			-->
			<section class="rounded-xl border border-dashed p-6">
				<h2 class="mb-2 font-semibold text-lg">What about speed and memory?</h2>
				<p class="text-muted-foreground text-sm leading-relaxed">
					Neither {c.name} nor I publish benchmark numbers, and the figures you'll find in
					comparison articles never say how they were measured. I'd rather not add to that.
					I'm testing both apps on the same machine, and the numbers will show up here with
					the versions, the hardware and the method.
				</p>
			</section>

			{#if c.importer}
				<section class="rounded-xl border bg-card p-6">
					<h2 class="mb-2 font-semibold text-lg">Moving across from {c.name}</h2>
					<p class="mb-4 text-muted-foreground text-sm leading-relaxed">
						Seaquel reads {c.name}'s saved connections, so you're not retyping your whole
						connection list. Passwords don't come across — they stay in your system keychain
						and you enter them once, the first time you connect.
					</p>
					<a
						href="/download"
						class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-sm hover:bg-primary/90"
					>
						<DownloadIcon class="size-4" />
						Download Seaquel
					</a>
				</section>
			{/if}

			<CompetitorFaq faq={c.faq} />

			<VerifiedFooter vendor={c.name} verifiedOn={c.verifiedOn} sources={c.sources} />

			{#if c.related.length}
				<section>
					<h2 class="mb-4 font-semibold text-lg">Other comparisons</h2>
					<ul class="grid gap-2 sm:grid-cols-2">
						{#each c.related as other (other.slug)}
							<li>
								<a
									href="/compare/{other.slug}"
									class="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
								>
									Seaquel vs {other.name}
									<ArrowRightIcon class="size-4 text-muted-foreground" />
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		</div>

		<FooterSection />
	</div>
</div>
