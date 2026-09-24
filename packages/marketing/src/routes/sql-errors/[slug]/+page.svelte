<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		ArrowLeftIcon,
		ArrowRightIcon,
		ChevronRightIcon,
		GraduationCapIcon,
		PlayIcon,
		TriangleAlertIcon
	} from "lucide-svelte";
	import type { PageData } from "./$types";
	import Seo from "$lib/components/seo.svelte";
	import { codeLinks } from "$lib/sql-errors";
	import { sqlErrorWidget } from "$lib/sql-errors/widget";
	import { onMount } from "svelte";

	let { data }: { data: PageData } = $props();

	const origin = "https://seaquel.app";
	const entry = $derived(data.entry);
	const codes = $derived(codeLinks(entry.codes));

	onMount(() => {
		// Registers <seaquel-sql>, the broken/fixed sandbox below.
		import("../../../embed/seaquel-sql");
	});

	const jsonLd = $derived(
		JSON.stringify([
			{
				"@context": "https://schema.org",
				"@type": "TechArticle",
				headline: entry.title,
				description: entry.description,
				url: `${origin}/sql-errors/${entry.slug}`,
				inLanguage: "en",
				isAccessibleForFree: true,
				proficiencyLevel: "Beginner",
				publisher: { "@type": "Organization", name: "Seaquel", url: origin }
			},
			{
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				itemListElement: [
					{ "@type": "ListItem", position: 1, name: "SQL errors", item: `${origin}/sql-errors` },
					{
						"@type": "ListItem",
						position: 2,
						name: entry.title,
						item: `${origin}/sql-errors/${entry.slug}`
					}
				]
			}
		])
	);
</script>

<Seo title={entry.seoTitle} description={entry.description} ogType="article" />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>

<style>
	.error-content :global(h2[id]),
	.error-content :global(h3[id]) {
		scroll-margin-top: 6rem;
	}
</style>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<article class="py-12 md:py-16">
			<div class="container mx-auto px-4 md:px-6 max-w-6xl">
				<div class="flex items-center justify-between mb-8">
					<Button href="/sql-errors" variant="ghost" size="sm" class="-ml-2 gap-2">
						<ArrowLeftIcon class="size-4" />
						All SQL errors
					</Button>
					<nav class="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
						<a href="/learn-sql" class="hover:text-primary transition-colors">Learn SQL</a>
						<ChevronRightIcon class="size-3.5 opacity-50" />
						<a href="/sql-errors" class="hover:text-primary transition-colors">SQL errors</a>
					</nav>
				</div>

				<div class="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-10 lg:gap-14 items-start">
					<div class="min-w-0">
						<header class="mb-10">
							<div
								class="text-[11px] font-medium text-primary mb-3 tracking-wide uppercase inline-flex items-center gap-1.5"
							>
								<TriangleAlertIcon class="size-3.5" />
								SQL error
							</div>
							<h1
								class="font-mono text-2xl md:text-4xl font-semibold tracking-tight mb-5 text-balance break-words"
							>
								{entry.title}
							</h1>
							<p class="text-lg md:text-xl text-muted-foreground text-pretty">
								{entry.description}
							</p>
						</header>

						{#snippet engineCell(engine: string)}
							<th class="px-4 py-2.5 text-left font-medium align-top whitespace-nowrap w-32">
								{engine}
								{#if codes[engine]}
									<a
										href={codes[engine].href}
										class="block font-mono text-xs font-normal text-muted-foreground hover:text-primary transition-colors"
									>
										{codes[engine].label}
									</a>
								{/if}
							</th>
						{/snippet}

						{#if entry.messages.length > 0}
							<section class="mb-10 rounded-lg border overflow-hidden" aria-label="Error text by database">
								<table class="w-full text-sm">
									<tbody>
										<tr class="bg-muted/40">
											{@render engineCell("PostgreSQL")}
											<td class="px-4 py-2.5 font-mono text-xs md:text-sm break-words">
												ERROR: {entry.error}
											</td>
										</tr>
										{#each entry.messages as message (message.engine)}
											<tr class="border-t">
												{@render engineCell(message.engine)}
												{#if message.text}
													<td class="px-4 py-2.5 font-mono text-xs md:text-sm break-words">
														{message.text}
													</td>
												{:else}
													<td class="px-4 py-2.5 text-muted-foreground italic">{message.note}</td>
												{/if}
											</tr>
										{/each}
									</tbody>
								</table>
							</section>
						{/if}

						<!--
							Prose first: it is what search engines index. The sandbox below
							hydrates into a live Postgres, but its static HTML still carries
							both queries.
						-->
						<div
							class="error-content prose prose-lg dark:prose-invert max-w-none
								prose-headings:font-semibold prose-headings:tracking-tight
								prose-a:text-primary prose-a:no-underline hover:prose-a:underline
								prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
								prose-pre:bg-muted prose-pre:border
								prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r
								prose-li:marker:text-primary"
						>
							<entry.content />
						</div>

						<section class="mt-14 scroll-mt-24" id="try-it">
							<div class="flex items-center gap-2 mb-2">
								<PlayIcon class="size-4 text-primary" />
								<h2 class="text-2xl font-bold tracking-tight">Reproduce it, then fix it</h2>
							</div>
							<p class="text-muted-foreground mb-6">
								Run the broken query to see the error, then switch to the fixed one. Both run
								against the
								<a href="/learn-sql/sandbox" class="text-primary hover:underline">practice database</a>
								from the SQL course. Edit either query freely; every run is rolled back.
							</p>
							{@html sqlErrorWidget(entry)}
						</section>

						{#if entry.lessonLink}
							<a
								href="/learn-sql/{entry.lessonLink.slug}"
								class="group mt-14 flex items-center gap-4 rounded-lg border bg-primary/5 p-5 hover:border-primary transition-colors"
							>
								<div
									class="size-10 shrink-0 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center"
								>
									<GraduationCapIcon class="size-5 text-primary" />
								</div>
								<div class="min-w-0 flex-1">
									<div class="text-xs text-muted-foreground mb-0.5">Understand the concept behind it</div>
									<div class="font-medium group-hover:text-primary transition-colors">
										Lesson: {entry.lessonLink.title}
									</div>
								</div>
								<ArrowRightIcon
									class="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
								/>
							</a>
						{/if}
					</div>

					<aside class="lg:sticky lg:top-24 flex flex-col gap-8">
						{#if entry.related.length > 0}
							<div>
								<div
									class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3"
								>
									Related errors
								</div>
								<ul class="border-l space-y-0.5">
									{#each entry.related as related (related.slug)}
										<li>
											<a
												href="/sql-errors/{related.slug}"
												class="block px-3 py-1.5 -ml-px border-l border-transparent font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary transition-colors break-words"
											>
												{related.title}
											</a>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						<div class="rounded-lg border p-5 bg-card">
							<div class="font-semibold mb-1.5">Catch these before you run them</div>
							<p class="text-sm text-muted-foreground mb-4">
								Seaquel is a SQL client for PostgreSQL, MySQL, SQLite, DuckDB and more. Its editor
								autocompletes from your schema and underlines problems before you execute.
							</p>
							<Button href="/download" size="sm" class="w-full">Download Seaquel</Button>
						</div>
					</aside>
				</div>
			</div>
		</article>

		<FooterSection />
	</div>
</div>
