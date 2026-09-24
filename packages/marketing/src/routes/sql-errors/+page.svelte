<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import { ArrowRightIcon, DatabaseIcon, TriangleAlertIcon } from "lucide-svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	// Grouped by the lesson each error belongs to, in course order, so the
	// index doubles as a map from "what broke" to "what to read".
	const groups = $derived.by(() => {
		const byLesson = data.lessons
			.map((lesson) => ({
				heading: lesson.title,
				lesson: lesson.slug as string | null,
				errors: data.errors.filter((e) => e.lesson === lesson.slug)
			}))
			.filter((group) => group.errors.length > 0);
		const known = new Set(data.lessons.map((l) => l.slug));
		const other = data.errors.filter((e) => !e.lesson || !known.has(e.lesson));
		return other.length > 0
			? [...byLesson, { heading: "Other errors", lesson: null, errors: other }]
			: byLesson;
	});
</script>

<Seo
	title="SQL Errors Explained, with Fixes You Can Run, and Every Error Code | Seaquel"
	description="What common SQL error messages mean and how to fix them, each with a runnable sandbox. Plus every error code for PostgreSQL, MySQL, SQLite and SQL Server."
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />
	<div class="pt-16">
		<section class="relative overflow-hidden bg-linear-to-br from-red-500/10 via-orange-500/5 to-background py-16 md:py-24">
			<div class="container relative mx-auto px-4 md:px-6 max-w-4xl text-center flex flex-col items-center gap-6">
				<div
					class="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 border border-red-500/20"
				>
					<TriangleAlertIcon class="size-4" />
					<span>SQL error reference</span>
				</div>
				<h1 class="text-4xl md:text-6xl font-bold tracking-tight text-balance">
					SQL errors, explained and fixed
				</h1>
				<p class="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
					Find the message your database printed. Each page explains what caused it, shows the
					fix, and has a sandbox where you can run the broken query and the fixed one. Only have a
					code? Look it up in the full list for your database.
				</p>
			</div>
		</section>

		<section class="pt-16 md:pt-20">
			<div class="container mx-auto px-4 md:px-6 max-w-4xl">
				<div class="flex items-baseline justify-between gap-4 mb-4 border-b pb-2">
					<h2 class="text-xl font-semibold tracking-tight">Error codes by database</h2>
				</div>
				<ul class="grid grid-cols-2 md:grid-cols-4 gap-3">
					{#each data.engines as engine (engine.slug)}
						<li>
							<a
								href="/sql-errors/{engine.slug}"
								class="group flex h-full flex-col gap-2 rounded-lg border bg-card p-4 hover:border-primary transition-colors"
							>
								<DatabaseIcon
									class="size-4 text-muted-foreground group-hover:text-primary transition-colors"
								/>
								<span class="font-medium group-hover:text-primary transition-colors">{engine.name}</span>
								<span class="text-sm text-muted-foreground">
									{engine.count.toLocaleString("en-US")} codes
								</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<section class="py-16 md:py-20">
			<div class="container mx-auto px-4 md:px-6 max-w-4xl flex flex-col gap-12">
				{#each groups as group (group.heading)}
					<div>
						<div class="flex items-baseline justify-between gap-4 mb-4 border-b pb-2">
							<h2 class="text-xl font-semibold tracking-tight">{group.heading}</h2>
							{#if group.lesson}
								<a
									href="/learn-sql/{group.lesson}"
									class="text-sm text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
								>
									Read the lesson →
								</a>
							{/if}
						</div>
						<ul class="flex flex-col gap-3">
							{#each group.errors as error (error.slug)}
								<li>
									<a
										href="/sql-errors/{error.slug}"
										class="group flex items-start justify-between gap-4 rounded-lg border bg-card p-4 hover:border-primary transition-colors"
									>
										<div class="min-w-0">
											<div
												class="font-mono text-sm md:text-base font-medium break-words group-hover:text-primary transition-colors"
											>
												{error.title}
											</div>
											<p class="text-sm text-muted-foreground mt-1 text-pretty">
												{error.description}
											</p>
										</div>
										<ArrowRightIcon
											class="size-4 mt-1 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
										/>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</section>

		<FooterSection />
	</div>
</div>
