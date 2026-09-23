<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		ArrowLeftIcon,
		AwardIcon,
		ArrowRightIcon,
		ChevronRightIcon,
		ClockIcon,
		ListIcon,
		PlayIcon,
		TriangleAlertIcon
	} from "lucide-svelte";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import Seo from "$lib/components/seo.svelte";
	import SqlChallenge from "$lib/components/sql-challenge.svelte";
	import { getChallenges, TOTAL_CHALLENGES } from "$lib/learn-sql/challenges";
	import { exportProgress, getSolved, markSolved } from "$lib/learn-sql/progress";

	let { data }: { data: PageData } = $props();

	const origin = "https://seaquel.app";

	// Position is derived from the published lessons, not from the raw `order`
	// field, so gaps in the sequence never surface as "Lesson 8 of 2".
	const position = $derived(data.all.findIndex((l) => l.slug === data.lesson.slug) + 1);

	const challenges = $derived(getChallenges(data.lesson.slug));

	// Progress lives in localStorage, which SSR can't see, so this stays empty
	// until hydration. The page is prerendered — reading it during render would
	// bake one visitor's progress into the static HTML.
	let solved = $state<string[]>([]);

	// Course-wide total for the sidebar, so the certificate shows real progress
	// from any lesson rather than only counting this one.
	let courseSolved = $state(0);

	onMount(() => {
		solved = getSolved(data.lesson.slug);
		courseSolved = Object.values(exportProgress()).reduce((n, ids) => n + ids.length, 0);
	});

	const courseComplete = $derived(courseSolved >= TOTAL_CHALLENGES);

	const solvedCount = $derived(challenges.filter((c) => solved.includes(c.id)).length);
	const allSolved = $derived(challenges.length > 0 && solvedCount === challenges.length);

	function recordSolved(id: string) {
		markSolved(data.lesson.slug, id);
		if (!solved.includes(id)) solved = [...solved, id];
	}

	// LearningResource markup: each lesson is a standalone unit of the course,
	// which is what earns the "Course" treatment in search results.
	const jsonLd = $derived(
		JSON.stringify({
			"@context": "https://schema.org",
			"@type": "LearningResource",
			name: data.lesson.title,
			description: data.lesson.description,
			url: `${origin}/learn-sql/${data.lesson.slug}`,
			learningResourceType: "Tutorial",
			educationalLevel: "Beginner",
			teaches: data.lesson.title,
			inLanguage: "en",
			isAccessibleForFree: true,
			isPartOf: {
				"@type": "Course",
				name: "Learn SQL Interactively",
				url: `${origin}/learn-sql`,
				provider: { "@type": "Organization", name: "Seaquel", url: origin }
			}
		})
	);
</script>

<Seo title={data.lesson.seoTitle} description={data.lesson.description} />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>

<style>
	.lesson-content :global(h2[id]),
	.lesson-content :global(h3[id]) {
		scroll-margin-top: 6rem;
	}
</style>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<article class="py-12 md:py-16">
			<div class="container mx-auto px-4 md:px-6 max-w-6xl">
				<!-- Breadcrumb -->
				<div class="flex items-center justify-between mb-8">
					<Button href="/learn-sql" variant="ghost" size="sm" class="-ml-2 gap-2">
						<ArrowLeftIcon class="size-4" />
						All lessons
					</Button>
					<nav class="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
						<a href="/learn-sql" class="hover:text-primary transition-colors">Learn SQL</a>
						<ChevronRightIcon class="size-3.5 opacity-50" />
						<span class="text-foreground line-clamp-1 max-w-xs">{data.lesson.title}</span>
					</nav>
				</div>

				<div class="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
					<!-- Course navigation -->
					<aside class="hidden lg:block sticky top-24">
						<div
							class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3 inline-flex items-center gap-2"
						>
							<ListIcon class="size-3.5" />
							The course
						</div>
						<ul class="border-l space-y-0.5">
							{#each data.all as item (item.slug)}
								<li>
									<a
										href="/learn-sql/{item.slug}"
										class="block px-3 py-1.5 -ml-px border-l text-sm transition-colors {item.slug ===
										data.lesson.slug
											? 'border-primary text-primary font-medium'
											: 'border-transparent text-muted-foreground hover:text-foreground'}"
									>
										{item.title}
									</a>
								</li>
							{/each}
						</ul>

						<!--
							The certificate sits below the lesson list rather than in it: it
							isn't a lesson, and counting it as one would make every page say
							"Lesson n of 13". Without this, someone who lands on a lesson from
							search never learns the certificate exists.
						-->
						<a
							href="/learn-sql/certificate"
							class="mt-6 block rounded-lg border p-3 transition-colors hover:border-primary {courseComplete
								? 'border-green-500/40 bg-green-500/5'
								: ''}"
						>
							<div class="flex items-center gap-2 text-sm font-medium">
								<AwardIcon
									class="size-4 {courseComplete ? 'text-green-600 dark:text-green-400' : 'text-amber-500'}"
								/>
								Certificate
							</div>
							<p class="mt-1 text-xs text-muted-foreground">
								{#if courseComplete}
									Ready to claim.
								{:else}
									{courseSolved} of {TOTAL_CHALLENGES} challenges
								{/if}
							</p>
							{#if !courseComplete}
								<div class="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
									<div
										class="h-full bg-amber-500 transition-all"
										style="width: {Math.round((courseSolved / TOTAL_CHALLENGES) * 100)}%"
									></div>
								</div>
							{/if}
						</a>
					</aside>

					<div class="min-w-0">
						<header class="mb-10">
							<div
								class="text-sm font-medium text-primary mb-3 tracking-wide uppercase text-[11px]"
							>
								Lesson {position} of {data.all.length}
							</div>
							<h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-balance">
								{data.lesson.title}
							</h1>
							<p class="text-lg md:text-xl text-muted-foreground text-pretty">
								{data.lesson.description}
							</p>
							<div class="flex items-center gap-3 mt-5 text-sm text-muted-foreground">
								<span class="inline-flex items-center gap-1.5">
									<ClockIcon class="size-3.5" />
									{data.lesson.readTime} read
								</span>
							</div>
						</header>

						<!--
							The prose is server-rendered and deliberately sits ABOVE the
							interactive demo: the demo is an iframe, so nothing inside it is
							indexable. The text has to carry the page on its own.
						-->
						<div
							class="lesson-content prose prose-lg dark:prose-invert max-w-none
								prose-headings:font-semibold prose-headings:tracking-tight
								prose-a:text-primary prose-a:no-underline hover:prose-a:underline
								prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
								prose-pre:bg-muted prose-pre:border
								prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r
								prose-li:marker:text-primary"
						>
							<data.lesson.content />
						</div>

						{#if challenges.length > 0}
							<section class="mt-14 scroll-mt-24" id="practice">
								<div class="flex items-center gap-2 mb-2">
									<PlayIcon class="size-4 text-primary" />
									<h2 class="text-2xl font-bold tracking-tight">Your turn</h2>
									{#if solvedCount > 0}
										<span class="ml-auto text-sm font-medium {allSolved ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}">
											{solvedCount} of {challenges.length} solved
										</span>
									{/if}
								</div>
								<p class="text-muted-foreground mb-6">
									Write the query, run it, and it gets checked against a real PostgreSQL database
									running in this tab. Your answer is graded on the rows it returns, so any correct
									phrasing passes.
								</p>

								<div class="flex flex-col gap-5">
									{#each challenges as challenge, index (challenge.id)}
										<SqlChallenge
											{challenge}
											{index}
											solved={solved.includes(challenge.id)}
											onsolved={recordSolved}
										/>
									{/each}
								</div>

								{#if allSolved}
									<div class="mt-6 rounded-lg border border-green-500/40 bg-green-500/5 px-4 py-4 text-sm">
										<p class="font-medium text-green-700 dark:text-green-400">
											Lesson complete.
										</p>
										<p class="mt-1 text-muted-foreground">
											Progress is kept in this browser, no account needed.
											{#if data.lesson.next}
												<a href="/learn-sql/{data.lesson.next.slug}" class="text-primary hover:underline">
													On to {data.lesson.next.title}.
												</a>
											{/if}
										</p>
									</div>
								{/if}

								<p class="text-sm text-muted-foreground mt-6">
									Want the full editor, schema browser and query visualiser?
									<a href="/download" class="text-primary hover:underline">Download Seaquel</a>
									and point it at your own database.
								</p>
							</section>
						{/if}

						{#if data.errors.length > 0}
							<section class="mt-14">
								<div class="flex items-center gap-2 mb-2">
									<TriangleAlertIcon class="size-4 text-primary" />
									<h2 class="text-2xl font-bold tracking-tight">Errors you might hit</h2>
								</div>
								<p class="text-muted-foreground mb-6">
									What these messages mean and how to fix them, each with a sandbox to try the fix.
								</p>
								<ul class="flex flex-col gap-2">
									{#each data.errors as error (error.slug)}
										<li>
											<a
												href="/sql-errors/{error.slug}"
												class="group flex items-center justify-between gap-4 rounded-lg border px-4 py-3 hover:border-primary transition-colors"
											>
												<span
													class="font-mono text-sm break-words group-hover:text-primary transition-colors"
												>
													{error.title}
												</span>
												<ArrowRightIcon
													class="size-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
												/>
											</a>
										</li>
									{/each}
								</ul>
							</section>
						{/if}

						<!-- Prev / next keeps crawlers moving through the whole course -->
						<nav class="mt-16 pt-8 border-t grid sm:grid-cols-2 gap-4">
							{#if data.lesson.previous}
								<a
									href="/learn-sql/{data.lesson.previous.slug}"
									class="group rounded-lg border p-4 hover:border-primary transition-colors"
								>
									<div
										class="text-xs text-muted-foreground mb-1 inline-flex items-center gap-1.5"
									>
										<ArrowLeftIcon class="size-3.5" />
										Previous
									</div>
									<div class="font-medium group-hover:text-primary transition-colors">
										{data.lesson.previous.title}
									</div>
								</a>
							{:else}
								<div class="hidden sm:block"></div>
							{/if}

							{#if data.lesson.next}
								<a
									href="/learn-sql/{data.lesson.next.slug}"
									class="group rounded-lg border p-4 hover:border-primary transition-colors sm:text-right"
								>
									<div
										class="text-xs text-muted-foreground mb-1 inline-flex items-center gap-1.5 sm:justify-end sm:w-full"
									>
										Next
										<ArrowRightIcon class="size-3.5" />
									</div>
									<div class="font-medium group-hover:text-primary transition-colors">
										{data.lesson.next.title}
									</div>
								</a>
							{/if}
						</nav>
					</div>
				</div>
			</div>
		</article>

		<FooterSection />
	</div>
</div>
