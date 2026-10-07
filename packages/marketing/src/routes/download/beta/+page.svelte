<script lang="ts">
	import NavHeader from "#lib/components/nav-header.svelte";
	import FooterSection from "#lib/components/footer-section.svelte";
	import DownloadCards from "#lib/components/download-cards.svelte";
	import LogoDiscord from "#lib/components/logo-discord.svelte";
	import Seo from "#lib/components/seo.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { fade, fly } from "svelte/transition";
	import AlertCircleIcon from "@lucide/svelte/icons/circle-alert";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import FlaskConicalIcon from "@lucide/svelte/icons/flask-conical";
	import MessageSquareIcon from "@lucide/svelte/icons/message-square";
	import SettingsIcon from "@lucide/svelte/icons/settings";

	let { data } = $props();

	const release = $derived(data.release);
	// The beta channel falls back to stable between betas; only a
	// pre-release is a beta worth offering here.
	const hasBeta = $derived(release?.prerelease ?? false);
</script>

<Seo
	title="Download the Seaquel Beta"
	description="Try new Seaquel features before they reach the stable release. Beta builds for macOS, Windows and Linux."
	noindex
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<section class="py-20 md:py-28 bg-linear-to-b from-primary/10 via-background to-background">
			<div class="container mx-auto px-4 md:px-6 text-center">
				<div in:fade={{ duration: 600 }}>
					<div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20 mb-6">
						<FlaskConicalIcon class="size-4" />
						{#if hasBeta && release}
							<span>v{release.version}</span>
						{:else}
							<span>Beta</span>
						{/if}
					</div>
					<h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4">
						Seaquel Beta
					</h1>
					<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
						New features land here first, before the stable release. Expect the
						occasional rough edge, and tell us when you hit one.
					</p>
				</div>
			</div>
		</section>

		<section class="py-16 md:py-20">
			<div class="container mx-auto px-4 md:px-6">
				{#if hasBeta}
					<DownloadCards basePath="/download/beta" />
				{:else}
					<div
						class="max-w-2xl mx-auto rounded-xl border-2 bg-card p-6 md:p-8"
						in:fly={{ y: 20, delay: 100, duration: 500 }}
					>
						{#if release}
							<h2 class="text-lg font-semibold">No beta right now</h2>
							<p class="mt-2 text-muted-foreground">
								The current stable release, v{release.version}, is the newest build.
								Install it, then turn on Beta updates in Settings to get the next beta
								as soon as it's out.
							</p>
							<Button href="/download" class="mt-4 gap-2">
								Download Seaquel
								<ArrowRightIcon class="size-4" />
							</Button>
						{:else}
							<p class="flex items-start gap-2 text-sm text-muted-foreground">
								<AlertCircleIcon class="mt-0.5 size-4 shrink-0" />
								<span>
									We couldn't look up the latest beta right now. You can grab it from
									the releases page instead.
								</span>
							</p>
							<Button href={data.releasesUrl} variant="outline" class="mt-4 gap-2">
								<ExternalLinkIcon class="size-4" />
								Open GitHub releases
							</Button>
						{/if}
					</div>
				{/if}

				<div class="max-w-2xl mx-auto mt-12 space-y-6" in:fade={{ delay: 400, duration: 600 }}>
					<div class="flex items-start gap-3 text-muted-foreground">
						<SettingsIcon class="mt-1 size-4 shrink-0 text-primary" />
						<div>
							<p>
								<span class="font-medium text-foreground">Already using Seaquel?</span>
								No need to reinstall. Open Settings → General → Updates and turn on
								Beta updates. Turn it off anytime; you'll stay on your current
								version until a newer stable release is out.
							</p>
							<!-- Opens the app at that section. Builds before the link was
							     supported open the app and stay put, hence the steps above. -->
							<Button href="seaquel://settings/updates" variant="outline" size="sm" class="mt-3 gap-2">
								Open Seaquel settings
								<ArrowRightIcon class="size-4" />
							</Button>
						</div>
					</div>
					<div class="flex flex-wrap justify-center gap-2">
						<Button href="/discord" variant="ghost" class="gap-2">
							<LogoDiscord class="size-4 fill-current" />
							Talk about the beta on Discord
						</Button>
						<Button
							href="https://github.com/webstonehq/seaquel/issues"
							target="_blank"
							rel="noopener noreferrer"
							variant="ghost"
							class="gap-2"
						>
							<MessageSquareIcon class="size-4" />
							Report a bug
						</Button>
					</div>
				</div>
			</div>
		</section>

		<FooterSection />
	</div>
</div>
