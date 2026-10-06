<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import DownloadCards from "$lib/components/download-cards.svelte";
	import { fade } from "svelte/transition";
	import { DownloadIcon, ExternalLinkIcon, FlaskConicalIcon } from "lucide-svelte";
	import Seo from "$lib/components/seo.svelte";
	import ConsentSignup from "$lib/components/consent-signup.svelte";
	import { CONSENT_COPY } from "$lib/consent-copy";
</script>

<Seo
	title="Free SQL Client Download — macOS, Windows & Linux | Seaquel"
	description="Download Seaquel free for macOS (Apple Silicon & Intel), Windows and Linux. Native, fast, and fully functional without an account or license."
/>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<!-- Hero Section -->
		<section class="py-20 md:py-28 bg-linear-to-b from-primary/10 via-background to-background">
			<div class="container mx-auto px-4 md:px-6 text-center">
				<div in:fade={{ duration: 600 }}>
					<div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20 mb-6">
						<DownloadIcon class="size-4" />
						<span>Open Source</span>
					</div>
					<h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4">
						Download Seaquel
					</h1>
					<p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
						Choose your platform and start managing your databases with speed and efficiency.
					</p>
				</div>
			</div>
		</section>

		<!-- Download Cards Grid -->
		<section class="py-16 md:py-20">
			<div class="container mx-auto px-4 md:px-6">
				<DownloadCards />

				<!-- License notice -->
				<div class="text-center mt-10" in:fade={{ delay: 400, duration: 600 }}>
					<p class="text-sm text-muted-foreground">
						Free for personal use.
						<a
							href="/pricing"
							class="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
							>Using Seaquel at work?</a
						>
						&middot;
						<a
							href="/terms"
							class="text-foreground underline underline-offset-4 hover:text-primary transition-colors"
							>Terms</a
						>
					</p>
				</div>

				<!-- GitHub Releases Link -->
				<div class="text-center mt-12" in:fade={{ delay: 500, duration: 600 }}>
					<p class="text-muted-foreground mb-4">
						Looking for older versions, release notes, or early builds?
					</p>
					<div class="flex flex-wrap justify-center gap-2">
						<Button
							href="https://github.com/webstonehq/seaquel/releases"
							variant="ghost"
							class="gap-2"
						>
							<ExternalLinkIcon class="size-4" />
							View all releases on GitHub
						</Button>
						<Button href="/download/beta" variant="ghost" class="gap-2">
							<FlaskConicalIcon class="size-4" />
							Try the beta
						</Button>
					</div>
				</div>
			</div>
		</section>

		<!-- Research contact. Sits below the grid rather than gating the
		     download: nothing here blocks getting the app. -->
		<section class="pb-16 md:pb-24">
			<div class="container mx-auto px-4 md:px-6">
				<ConsentSignup
					purpose="research"
					source="download"
					heading="Help shape Seaquel"
					description="We're talking to people using Seaquel right now. What works, what's missing, and what it's worth to you."
					consentLabel={CONSENT_COPY.research}
					submitLabel="Count me in"
				/>
			</div>
		</section>

		<FooterSection />
	</div>
</div>
