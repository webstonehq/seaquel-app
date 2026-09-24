<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeftIcon, ExternalLinkIcon, HashIcon } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const origin = "https://seaquel.app";
	const index = $derived(data.index);
	const engine = $derived(index.engine);
	const count = $derived(index.count.toLocaleString("en-US"));

	/** Category headings double as anchors, e.g. #class-42. */
	function categoryId(name: string): string {
		return name
			.replace(/ — .*/, "")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-|-$/g, "");
	}

	/** Long SQL Server messages would turn the list into a wall of text. */
	function short(message: string): string {
		return message.length > 160 ? `${message.slice(0, 157).trimEnd()}…` : message;
	}

	const jsonLd = $derived(
		JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "SQL errors", item: `${origin}/sql-errors` },
				{ "@type": "ListItem", position: 2, name: `${engine.name} error codes` }
			]
		}).replaceAll("<", "\\u003c") // keeps text from upstream docs from closing the <script>
	);
</script>

<Seo
	title="{engine.name} Error Codes: the Full List of {count} | Seaquel"
	description="Every {engine.name} error code in one list: {count} codes, grouped the way the {engine.name} docs group them. Common errors link to a full explanation and fix."
/>

<!--
	The SQL Server list runs to thousands of rows, so row styles live here once
	rather than as utility classes repeated on every row.
-->
<style>
	li {
		scroll-margin-top: 6rem;
	}
	.row {
		display: grid;
		gap: 0.125rem 1rem;
		margin: 0 -0.5rem;
		padding: 0.625rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		transition: background-color 150ms;
	}
	@media (min-width: 640px) {
		.row {
			grid-template-columns: 9rem minmax(0, 1fr);
		}
	}
	.row:hover {
		background: color-mix(in oklab, var(--muted) 40%, transparent);
	}
	.row b {
		font-family: var(--font-mono);
		font-weight: 500;
		transition: color 150ms;
	}
	.row:hover b {
		color: var(--primary);
	}
	.row span {
		min-width: 0;
		overflow-wrap: break-word;
	}
	.row code {
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}
	.row small {
		display: block;
		font-size: inherit;
		color: var(--muted-foreground);
	}
</style>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<div class="container mx-auto px-4 md:px-6 max-w-5xl py-12 md:py-16">
			<Button href="/sql-errors" variant="ghost" size="sm" class="-ml-2 gap-2 mb-8">
				<ArrowLeftIcon class="size-4" />
				All SQL errors
			</Button>

			<header class="mb-10 max-w-3xl">
				<div
					class="text-[11px] font-medium text-primary mb-3 tracking-wide uppercase inline-flex items-center gap-1.5"
				>
					<HashIcon class="size-3.5" />
					Error code reference
				</div>
				<h1 class="text-3xl md:text-5xl font-bold tracking-tight mb-5 text-balance">
					{engine.name} error codes
				</h1>
				<p class="text-lg text-muted-foreground text-pretty mb-4">{engine.intro}</p>
				<p class="text-sm text-muted-foreground">
					{count} codes from the
					<a
						href={engine.sourceUrl}
						rel="noopener"
						class="text-primary hover:underline inline-flex items-center gap-1"
					>
						{engine.sourceName}
						<ExternalLinkIcon class="size-3" />
					</a>
				</p>
			</header>

			{#if index.categories.length > 1}
				<nav class="mb-12 rounded-lg border bg-card p-5" aria-label="Groups">
					<div class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3">
						Jump to
					</div>
					<ul class="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
						{#each index.categories as category (category.name)}
							<li class="min-w-0">
								<a
									href="#{categoryId(category.name)}"
									class="flex justify-between gap-3 py-0.5 text-muted-foreground hover:text-primary transition-colors"
								>
									<span class="truncate">{category.name}</span>
									<span class="tabular-nums opacity-70">{category.codes.length}</span>
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/if}

			<div class="flex flex-col gap-12">
				{#each index.categories as category (category.name)}
					<section id={categoryId(category.name)} class="scroll-mt-24">
						<h2 class="text-xl font-semibold tracking-tight mb-4 border-b pb-2">{category.name}</h2>
						<ul class="divide-y">
							{#each category.codes as code (code.slug)}
								<li id={code.slug}>
									<a href="/sql-errors/{engine.slug}/{code.slug}" class="row">
										<b>{code.code}</b>
										<span>
											{#if code.name}<code>{code.name}</code>{/if}
											{#if code.message}<small>{short(code.message)}</small>{/if}
										</span>
									</a>
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			</div>
		</div>

		<FooterSection />
	</div>
</div>
