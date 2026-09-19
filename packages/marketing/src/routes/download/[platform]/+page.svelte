<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import Seo from "$lib/components/seo.svelte";
	import ConsentSignup from "$lib/components/consent-signup.svelte";
	import LogoDiscord from "$lib/components/logo-discord.svelte";
	import { Button } from "$lib/components/ui/button";
	import { CONSENT_COPY } from "$lib/consent-copy";
	import { fade, fly } from "svelte/transition";
	import {
		AlertCircleIcon,
		ArrowRightIcon,
		BookOpenIcon,
		BriefcaseIcon,
		CheckIcon,
		CopyIcon,
		DatabaseIcon,
		ExternalLinkIcon,
		GraduationCapIcon,
		LifeBuoyIcon,
		MessageSquareIcon,
		RocketIcon,
	} from "lucide-svelte";

	let { data } = $props();

	const asset = $derived(data.asset);
	const title = $derived(`Seaquel for ${data.os}`);
	// Built as a string: whitespace at `{#if}` boundaries in markup gets
	// trimmed, which ran the separators into the version.
	const details = $derived(
		asset
			? [data.variant, `v${asset.version}`, formatSize(asset.size)].filter(Boolean).join(" · ")
			: "",
	);

	// Start the download. The asset responds with `Content-Disposition:
	// attachment`, so the browser saves the file and stays on this page.
	// An effect (not onMount) so picking another platform from the header
	// dropdown while on this page — same component, new data — starts
	// that download too.
	$effect(() => {
		const url = asset?.url;
		if (url) window.location.assign(url);
	});

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyUrl() {
		if (!asset) return;
		try {
			await navigator.clipboard.writeText(asset.url);
			copied = true;
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard can be blocked (permissions, insecure context); the
			// URL is on screen and selectable, so there's nothing to recover.
		}
	}

	function formatSize(bytes: number): string {
		return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
	}

	// Split so the filename can be emphasised, as it's what people look for.
	const urlPrefix = $derived(asset ? asset.url.slice(0, asset.url.lastIndexOf("/") + 1) : "");
	const urlFile = $derived(asset ? asset.url.slice(asset.url.lastIndexOf("/") + 1) : "");

	const nextSteps = [
		{ icon: RocketIcon, label: "Getting started guide", href: "/docs/getting-started/quick-start/" },
		{ icon: LifeBuoyIcon, label: "Trouble opening the app on first launch?", href: "/docs/getting-started/installation/#first-launch" },
		{ icon: DatabaseIcon, label: "Connect to PostgreSQL, MySQL, SQLite and more", href: "/docs/connections/creating-connections/" },
		{ icon: GraduationCapIcon, label: "Learn SQL with the built-in practice database", href: "/learn-sql" },
		{ icon: BriefcaseIcon, label: "Using Seaquel at work? See pricing", href: "/pricing" },
	];
</script>

<Seo
	title="Downloading {title}"
	description="Your Seaquel download is starting. Here's how to get set up."
/>

<svelte:head>
	<!-- One page per platform with no content of its own worth indexing;
	     /download is the canonical, indexable download page. -->
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<main class="pt-16">
		<div class="container mx-auto max-w-2xl px-4 md:px-6 py-16 md:py-24 space-y-8">
			<h1 class="text-4xl md:text-5xl font-bold tracking-tight" in:fade={{ duration: 500 }}>
				{#if asset}
					Your <span class="text-primary">download</span> is starting
				{:else}
					Almost there
				{/if}
			</h1>

			<!-- The file -->
			<section
				class="rounded-xl border-2 bg-card p-6 md:p-8"
				in:fly={{ y: 20, delay: 100, duration: 500 }}
			>
				<h2 class="text-lg font-semibold">{title}</h2>
				{#if asset}
					<p class="mt-1 text-sm text-muted-foreground">
						{details}
					</p>
					<div class="mt-4 flex items-center gap-2 rounded-md bg-muted px-3 py-2">
						<!-- The prefix truncates so the filename always shows. Still
						     selectable (selection copies the full text) in case the
						     clipboard is unavailable. -->
						<code class="flex min-w-0 flex-1 whitespace-nowrap text-xs md:text-sm" title={asset.url}>
							<span class="truncate text-muted-foreground">{urlPrefix}</span><span class="shrink-0 font-semibold">{urlFile}</span>
						</code>
						<button
							type="button"
							onclick={copyUrl}
							class="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
							aria-label={copied ? "Copied" : "Copy download link"}
						>
							{#if copied}
								<CheckIcon class="size-4 text-primary" />
							{:else}
								<CopyIcon class="size-4" />
							{/if}
						</button>
					</div>
					<p class="mt-4 text-sm text-muted-foreground">
						Download didn't start?
						<a
							href={asset.url}
							class="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
							>Download it directly</a
						>.
					</p>
				{:else}
					<p class="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
						<AlertCircleIcon class="mt-0.5 size-4 shrink-0" />
						<span>
							We couldn't look up the latest build right now. You can grab it from
							the releases page instead.
						</span>
					</p>
					<Button href={data.releasesUrl} variant="outline" class="mt-4 gap-2">
						<ExternalLinkIcon class="size-4" />
						Open GitHub releases
					</Button>
				{/if}
			</section>

			<!-- Research contact. Below the file card on purpose: the download
			     never waits on it. -->
			<div in:fly={{ y: 20, delay: 200, duration: 500 }}>
				<ConsentSignup
					purpose="research"
					source="download-started"
					heading="Help shape Seaquel"
					description="We're talking to people using Seaquel right now. What works, what's missing, and what it's worth to you."
					consentLabel={CONSENT_COPY.research}
					submitLabel="Count me in"
				/>
			</div>

			<!-- What's next -->
			<section
				class="rounded-xl border-2 bg-card p-6 md:p-8"
				in:fly={{ y: 20, delay: 300, duration: 500 }}
			>
				<h2 class="flex items-center gap-2 text-lg font-semibold">
					<BookOpenIcon class="size-5 text-primary" />
					What's next
				</h2>
				<ul class="mt-4">
					{#each nextSteps as step (step.href)}
						{@const Icon = step.icon}
						<li>
							<a
								href={step.href}
								class="group flex items-center gap-3 rounded-md px-2 py-2.5 -mx-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
							>
								<Icon class="size-4 shrink-0" />
								<span class="flex-1">{step.label}</span>
								<ArrowRightIcon class="size-4 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5" />
							</a>
						</li>
					{/each}
				</ul>
				<div class="my-3 border-t border-dashed"></div>
				<ul>
					<li>
						<a
							href="/discord"
							class="group flex items-center gap-3 rounded-md px-2 py-2.5 -mx-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							<LogoDiscord class="size-4 shrink-0 fill-current" />
							<span class="flex-1">Join the Discord</span>
							<ArrowRightIcon class="size-4 shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5" />
						</a>
					</li>
					<li>
						<a
							href="https://github.com/webstonehq/seaquel/issues"
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-3 rounded-md px-2 py-2.5 -mx-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							<MessageSquareIcon class="size-4 shrink-0" />
							<span class="flex-1">Request a feature or report a bug</span>
							<ExternalLinkIcon class="size-4 shrink-0 opacity-50" />
						</a>
					</li>
				</ul>
			</section>
		</div>
	</main>

	<FooterSection />
</div>
