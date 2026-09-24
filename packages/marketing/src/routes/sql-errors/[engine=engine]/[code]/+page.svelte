<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		ArrowLeftIcon,
		ArrowRightIcon,
		BookOpenIcon,
		ChevronRightIcon,
		ExternalLinkIcon,
		HashIcon,
		PlayIcon
	} from "lucide-svelte";
	import { sqlErrorWidget } from "$lib/sql-errors/widget";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	const origin = "https://seaquel.app";
	const page = $derived(data.page);
	const engine = $derived(page.engine);
	const code = $derived(page.code);

	/** "undefined_column" reads better in a sentence as "undefined column". */
	const conditionName = $derived(code.name?.replaceAll("_", " "));

	/** What the code is, as one sentence. The message, if any, is shown on its own below. */
	const summary = $derived.by(() => {
		switch (engine.slug) {
			case "postgresql":
				return `${code.code} is the SQLSTATE PostgreSQL reports for ${conditionName}, in ${code.category.replace(/^Class (\w+) — /, "class $1, ")}.`;
			case "mysql":
				return `MySQL ${code.category === "Client errors" ? "client" : "server"} error ${code.code} is ${code.name}${code.sqlstate ? `, reported with SQLSTATE ${code.sqlstate}` : ""}.`;
			case "sqlite":
				return `${code.name} is SQLite result code ${code.code}${code.name !== code.category ? `, an extended code of ${code.category}` : ""}.`;
			default:
				return `SQL Server raises error ${code.code} at severity ${code.severity}, which marks a problem with the query or data that you can correct.`;
		}
	});

	const seoTitle = $derived.by(() => {
		if (engine.slug === "sqlite") return `${page.title} (${code.code}) | Seaquel`;
		// Short messages are what people paste into search; long ones would be cut off.
		const detail =
			engine.slug !== "postgresql" && code.message && code.message.length <= 70
				? code.message
				: code.name;
		return `${page.title}${detail ? `: ${detail}` : ""} | Seaquel`;
	});

	const metaDescription = $derived(
		[
			summary,
			code.message ? `Message: ${code.message.replace(/[^.!?]$/, "$&.")}` : undefined,
			page.guides.length > 0
				? "What causes it and how to fix it, with a query you can run."
				: (page.example?.note ?? code.description?.split("\n\n")[0])
		]
			.filter(Boolean)
			.join(" ")
			.slice(0, 300)
	);

	const facts = $derived(
		[
			[engine.codeLabel, code.code],
			[engine.slug === "postgresql" ? "Condition name" : "Name", code.name],
			["SQLSTATE", engine.slug === "postgresql" ? undefined : code.sqlstate],
			["Severity", code.severity?.toString()],
			[
				engine.slug === "sqlite" ? "Primary code" : engine.slug === "postgresql" ? "Class" : "Group",
				code.category.replace(/^Class /, "")
			]
		].filter((fact): fact is [string, string] => Boolean(fact[1]))
	);

	const jsonLd = $derived(
		JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "SQL errors", item: `${origin}/sql-errors` },
				{
					"@type": "ListItem",
					position: 2,
					name: `${engine.name} error codes`,
					item: `${origin}/sql-errors/${engine.slug}`
				},
				{ "@type": "ListItem", position: 3, name: page.title }
			]
		}).replaceAll("<", "\\u003c") // keeps text from upstream docs from closing the <script>
	);
</script>

<Seo title={seoTitle} description={metaDescription} ogType="article" noindex={!page.indexable} />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
	{#if page.example}
		<!-- The page ships no SvelteKit JS; the widget registers itself. -->
		{@html `<script type="module" src="/embed/seaquel-sql.js"><\/script>`}
	{/if}
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<article class="py-12 md:py-16">
			<div class="container mx-auto px-4 md:px-6 max-w-6xl">
				<div class="flex items-center justify-between mb-8">
					<Button href="/sql-errors/{engine.slug}" variant="ghost" size="sm" class="-ml-2 gap-2">
						<ArrowLeftIcon class="size-4" />
						All {engine.name} error codes
					</Button>
					<nav class="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
						<a href="/sql-errors" class="hover:text-primary transition-colors">SQL errors</a>
						<ChevronRightIcon class="size-3.5 opacity-50" />
						<a href="/sql-errors/{engine.slug}" class="hover:text-primary transition-colors">
							{engine.name}
						</a>
					</nav>
				</div>

				<div class="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-10 lg:gap-14 items-start">
					<div class="min-w-0">
						<header class="mb-8">
							<div
								class="text-[11px] font-medium text-primary mb-3 tracking-wide uppercase inline-flex items-center gap-1.5"
							>
								<HashIcon class="size-3.5" />
								{engine.name} error code
							</div>
							<h1
								class="font-mono text-2xl md:text-4xl font-semibold tracking-tight mb-5 text-balance break-words"
							>
								{page.title}
							</h1>
							<p class="text-lg text-muted-foreground text-pretty">{summary}</p>
						</header>

						{#if code.message}
							<pre
								class="mb-8 rounded-lg border bg-muted px-4 py-3 font-mono text-sm whitespace-pre-wrap break-words">{code.message}</pre>
						{/if}

						<section class="mb-10 rounded-lg border overflow-hidden" aria-label="Details">
							<table class="w-full text-sm">
								<tbody>
									{#each facts as [label, value], i (label)}
										<tr class={i > 0 ? "border-t" : ""}>
											<th class="px-4 py-2.5 text-left font-medium align-top whitespace-nowrap w-40">
												{label}
											</th>
											<td class="px-4 py-2.5 font-mono text-xs md:text-sm break-words">{value}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</section>

						{#if page.example}
							<section class="mb-10" id="try-it">
								<div class="flex items-center gap-2 mb-2">
									<PlayIcon class="size-4 text-primary" />
									<h2 class="text-xl font-semibold tracking-tight">Reproduce it, then fix it</h2>
								</div>
								<p class="text-muted-foreground mb-6 text-pretty">
									{page.example.note ?? "These are the queries from the guide below."}
									Run the broken query to see the error, then switch to the fixed one. Edit either
									freely; every run is rolled back.
								</p>
								{@html sqlErrorWidget(page.example)}
							</section>
						{/if}

						{#if page.guides.length > 0}
							<section class="mb-10">
								<h2 class="text-xl font-semibold tracking-tight mb-4">How to fix it</h2>
								<div class="flex flex-col gap-3">
									{#each page.guides as guide (guide.slug)}
										<a
											href="/sql-errors/{guide.slug}"
											class="group flex items-center gap-4 rounded-lg border bg-primary/5 p-5 hover:border-primary transition-colors"
										>
											<div
												class="size-10 shrink-0 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center"
											>
												<BookOpenIcon class="size-5 text-primary" />
											</div>
											<div class="min-w-0 flex-1">
												<div class="text-xs text-muted-foreground mb-0.5">
													Explained step by step, with a query you can run
												</div>
												<div
													class="font-mono text-sm font-medium group-hover:text-primary transition-colors break-words"
												>
													{guide.title}
												</div>
											</div>
											<ArrowRightIcon
												class="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
											/>
										</a>
									{/each}
								</div>
							</section>
						{/if}

						{#if code.description}
							<section class="mb-10">
								<h2 class="text-xl font-semibold tracking-tight mb-4">What it means</h2>
								<div class="prose dark:prose-invert max-w-none">
									{#each code.description.split("\n\n") as paragraph, i (i)}
										<p>{paragraph}</p>
									{/each}
								</div>
							</section>
						{/if}

						{#if page.equivalents.length > 0}
							<section class="mb-10">
								<h2 class="text-xl font-semibold tracking-tight mb-4">In other databases</h2>
								<ul class="rounded-lg border divide-y text-sm">
									{#each page.equivalents as other (other.engine + other.code)}
										<li>
											<a
												href="/sql-errors/{other.engine}/{other.slug}"
												class="flex items-baseline gap-4 px-4 py-2.5 hover:text-primary transition-colors"
											>
												<span class="font-medium w-28 shrink-0">{other.engineName}</span>
												<span class="font-mono break-words">
													{other.code}{other.name ? ` ${other.name}` : ""}
												</span>
											</a>
										</li>
									{/each}
								</ul>
							</section>
						{/if}

						<p class="text-sm text-muted-foreground">
							Source:
							<a
								href={code.docsUrl}
								rel="noopener"
								class="text-primary hover:underline inline-flex items-center gap-1"
							>
								{engine.sourceName}
								<ExternalLinkIcon class="size-3" />
							</a>
						</p>
					</div>

					<aside class="lg:sticky lg:top-24 flex flex-col gap-8">
						{#if page.siblings.length > 0}
							<div>
								<div
									class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3"
								>
									{code.category}
								</div>
								<ul class="border-l space-y-0.5">
									{#each page.siblings as sibling (sibling.code)}
										<li>
											<a
												href="/sql-errors/{sibling.engine}/{sibling.slug}"
												class="block px-3 py-1.5 -ml-px border-l border-transparent font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary transition-colors break-words"
											>
												{engine.slug === "sqlite" ? sibling.name : sibling.code}
												{#if engine.slug === "postgresql" && sibling.name}
													<span class="opacity-70">{sibling.name}</span>
												{/if}
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
