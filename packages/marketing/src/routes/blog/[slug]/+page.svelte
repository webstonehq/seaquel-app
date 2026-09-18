<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import PostCard from "$lib/components/blog/post-card.svelte";
	import NewsletterSignup from "$lib/components/blog/newsletter-signup.svelte";
	import {
		ArrowLeftIcon,
		CalendarIcon,
		ClockIcon,
		ChevronRightIcon,
		ListIcon,
		LinkIcon,
		MailIcon,
		CheckIcon,
		UserIcon
	} from "lucide-svelte";
	import { fly } from "svelte/transition";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import Seo from "$lib/components/seo.svelte";
	import authorAvatar from "$lib/assets/mike_headshot.webp";

	let { data }: { data: PageData } = $props();

	let activeSection = $state("");
	let copied = $state(false);
	let shareUrl = $state("");

	$effect(() => {
		activeSection = data.entry.sections[0]?.id ?? "";
	});

	onMount(() => {
		shareUrl = window.location.href;

		const ids = data.entry.sections.map((s) => s.id);
		const observed: HTMLElement[] = [];
		for (const id of ids) {
			const el = document.getElementById(id);
			if (el) observed.push(el);
		}

		if (observed.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible[0]) {
					activeSection = visible[0].target.id;
				}
			},
			{ rootMargin: "-100px 0px -60% 0px", threshold: 0 }
		);

		for (const el of observed) observer.observe(el);

		return () => observer.disconnect();
	});

	function scrollTo(id: string) {
		const el = document.getElementById(id);
		if (el) {
			window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
		}
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(shareUrl);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch {
			/* ignore */
		}
	}

	const bskyHref = $derived(
		`https://bsky.app/intent/compose?text=${encodeURIComponent(data.entry.title)}%20${encodeURIComponent(shareUrl)}`
	);
	const xHref = $derived(
		`https://x.com/intent/post?text=${encodeURIComponent(data.entry.title)}&url=${encodeURIComponent(shareUrl)}`
	);
	const mailHref = $derived(
		`mailto:?subject=${encodeURIComponent(data.entry.title)}&body=${encodeURIComponent(shareUrl)}`
	);
	const approxWords = $derived(Math.round(data.entry.wordCount / 10) * 10);
</script>

<Seo
	title="{data.entry.title} - Seaquel Blog"
	description={data.entry.description}
	ogImage="/blog/{data.entry.slug}/og-light.webp"
/>

<style>
	.article-content :global(h2[id]),
	.article-content :global(h3[id]) {
		position: relative;
		scroll-margin-top: 6rem;
	}
	.article-content :global(h2[id] > a),
	.article-content :global(h3[id] > a) {
		color: inherit;
		text-decoration: none;
	}
	.article-content :global(h2[id] > a:hover),
	.article-content :global(h3[id] > a:hover) {
		text-decoration: none;
	}
	.article-content :global(h2[id])::before,
	.article-content :global(h3[id])::before {
		content: "#";
		position: absolute;
		right: 100%;
		margin-right: 0.25rem;
		opacity: 0;
		color: var(--color-primary);
		transition: opacity 0.2s;
	}
	.article-content :global(h2[id]:hover)::before,
	.article-content :global(h3[id]:hover)::before {
		opacity: 0.5;
	}
</style>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<article class="py-12 md:py-16">
			<div class="container mx-auto px-4 md:px-6 max-w-3xl">
				<!-- Back link + breadcrumb -->
				<div in:fly={{ y: 20, duration: 400 }} class="flex items-center justify-between mb-8">
					<Button href="/blog" variant="ghost" size="sm" class="-ml-2 gap-2">
						<ArrowLeftIcon class="size-4" />
						All posts
					</Button>
					<nav class="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
						<a href="/blog" class="hover:text-primary transition-colors">Blog</a>
						<ChevronRightIcon class="size-3.5 opacity-50" />
						<span class="text-foreground line-clamp-1 max-w-xs">{data.entry.title}</span>
					</nav>
				</div>

				<!-- Header -->
				<header in:fly={{ y: 30, delay: 100, duration: 600 }} class="mb-10 md:mb-12 text-center">
					<h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-balance">
						{data.entry.title}
					</h1>
					<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
						{data.entry.description}
					</p>
					<div class="flex items-center justify-center gap-3 mt-6 text-sm text-muted-foreground flex-wrap">
						<div class="inline-flex items-center gap-2">
							<enhanced:img
								src={authorAvatar}
								alt={data.entry.author.name}
								class="size-7 rounded-full object-cover"
							/>
							<span class="font-medium text-foreground">{data.entry.author.name}</span>
						</div>
						<span class="opacity-40">·</span>
						<span class="inline-flex items-center gap-1.5">
							<CalendarIcon class="size-3.5" />
							<time datetime={data.entry.date}>{data.entry.dateFormatted}</time>
						</span>
						<span class="opacity-40">·</span>
						<span class="inline-flex items-center gap-1.5">
							<ClockIcon class="size-3.5" />
							{data.entry.readTime}
						</span>
					</div>
				</header>
			</div>

			<!-- 3-column layout -->
			<div class="container mx-auto px-4 md:px-6 max-w-6xl">
				<div class="grid lg:grid-cols-[220px_minmax(0,1fr)_220px] gap-10 lg:gap-12 items-start">
					<!-- TOC -->
					<aside class="hidden lg:block sticky top-24">
						{#if data.entry.sections.length > 0}
							<div class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-3 inline-flex items-center gap-2">
								<ListIcon class="size-3.5" />
								On this page
							</div>
							<ul class="border-l space-y-0.5">
								{#each data.entry.sections as section (section.id)}
									<li>
										<button
											type="button"
											onclick={() => scrollTo(section.id)}
											class="block w-full text-left px-3 py-1.5 -ml-px border-l text-sm transition-colors {activeSection === section.id
												? 'border-primary text-primary'
												: 'border-transparent text-muted-foreground hover:text-foreground'}"
										>
											{section.title}
										</button>
									</li>
								{/each}
							</ul>
						{/if}
					</aside>

					<!-- Article -->
					<div
						in:fly={{ y: 30, delay: 200, duration: 600 }}
						class="article-content prose prose-lg dark:prose-invert max-w-none mx-auto
							prose-headings:font-semibold prose-headings:tracking-tight
							prose-h2:scroll-mt-24 prose-h3:scroll-mt-24
							prose-a:text-primary prose-a:no-underline hover:prose-a:underline
							prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
							prose-pre:bg-muted prose-pre:border
							prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r
							prose-li:marker:text-primary"
					>
						<data.entry.content />
					</div>

					<!-- Right rail -->
					<aside class="hidden lg:flex lg:sticky lg:top-24 flex-col gap-6 text-sm">
						<div>
							<div class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2 inline-flex items-center gap-2">
								<UserIcon class="size-3.5" />
								Written by
							</div>
							<div class="flex items-center gap-3 rounded-md border bg-card p-3">
								<enhanced:img
									src={authorAvatar}
									alt={data.entry.author.name}
									class="size-9 rounded-full object-cover"
								/>
								<div class="flex flex-col leading-tight min-w-0">
									<span class="text-sm font-medium truncate">{data.entry.author.name}</span>
									<span class="text-xs text-muted-foreground truncate">{data.entry.author.role}</span>
								</div>
							</div>
						</div>

						<div>
							<div class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2">Share</div>
							<div class="flex flex-col gap-1.5">
								<Button href={bskyHref} target="_blank" rel="noreferrer" variant="outline" size="sm" class="justify-start gap-2">
									<svg viewBox="0 0 600 530" class="size-4" fill="currentColor" aria-hidden="true">
										<path d="M135.72 44.03C202.216 93.951 273.74 195.17 300 249.49c26.262-54.316 97.782-155.54 164.28-205.46C512.26 8.009 590-19.862 590 68.825c0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.38-3.69-10.832-3.708-7.896-.017-2.936-1.193.516-3.707 7.896-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.45-163.25-81.433C20.15 217.613 9.997 86.535 9.997 68.825c0-88.687 77.742-60.816 125.72-24.795z" />
									</svg>
									Share on Bluesky
								</Button>
								<Button href={xHref} target="_blank" rel="noreferrer" variant="outline" size="sm" class="justify-start gap-2">
									<svg viewBox="0 0 24 24" class="size-4" fill="currentColor" aria-hidden="true">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
									Share on X
								</Button>
								<Button onclick={copyLink} variant="outline" size="sm" class="justify-start gap-2">
									{#if copied}
										<CheckIcon class="size-4" />
										Copied!
									{:else}
										<LinkIcon class="size-4" />
										Copy link
									{/if}
								</Button>
								<Button href={mailHref} variant="outline" size="sm" class="justify-start gap-2">
									<MailIcon class="size-4" />
									Email a friend
								</Button>
							</div>
						</div>

						<div>
							<div class="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mb-2">Reading time</div>
							<div class="text-2xl font-semibold text-primary tracking-tight">
								{data.entry.readTime.replace(" read", "")}
							</div>
							<div class="text-xs text-muted-foreground mt-0.5">
								About {approxWords.toLocaleString()} words
							</div>
						</div>
					</aside>
				</div>
			</div>
		</article>

		{#if data.related.length > 0}
			<section class="py-12 md:py-16 border-t bg-muted/30">
				<div class="container mx-auto px-4 md:px-6 max-w-6xl">
					<h2 class="text-2xl font-bold tracking-tight mb-8">Keep reading</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{#each data.related as entry (entry.slug)}
							<PostCard {entry} />
						{/each}
					</div>
				</div>
			</section>
		{/if}

		<section class="py-16 md:py-20">
			<div class="container mx-auto px-4 md:px-6">
				<NewsletterSignup
					heading="Liked this? Get the next one."
					description="New writing from the Seaquel team, delivered once a week."
					source="blog-post:{data.entry.slug}"
				/>
			</div>
		</section>

		<FooterSection />
	</div>
</div>
