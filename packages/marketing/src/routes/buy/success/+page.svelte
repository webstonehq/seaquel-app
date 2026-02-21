<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Button } from "$lib/components/ui/button";
	import { Card } from "$lib/components/ui/card";
	import DownloadDropdown from "$lib/components/download-dropdown.svelte";
	import { fly } from "svelte/transition";
	import {
		CircleCheckIcon,
		MailIcon,
		DownloadIcon,
		HelpCircleIcon,
	} from "lucide-svelte";
	import { page } from "$app/state";

	const sessionId = page.url.searchParams.get("session_id") || page.url.searchParams.get("order_id");
</script>

<svelte:head>
	<title>Payment Successful - Seaquel</title>
	<meta name="description" content="Your Seaquel license purchase was successful." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<section class="py-16 md:py-24">
			<div class="container mx-auto px-4 md:px-6 max-w-2xl">
				<!-- Success header -->
				<div
					class="text-center mb-10"
					in:fly={{ y: 20, duration: 500 }}
				>
					<div
						class="inline-flex items-center justify-center size-16 rounded-full bg-green-500/10 mb-6"
					>
						<CircleCheckIcon class="size-8 text-green-500" />
					</div>
					<h1
						class="text-3xl md:text-4xl font-bold tracking-tight mb-3"
					>
						Payment Successful
					</h1>
					<p class="text-muted-foreground text-lg">
						Thank you for purchasing a Seaquel license.
					</p>
				</div>

				<div
					class="flex flex-col gap-6"
					in:fly={{ y: 20, delay: 100, duration: 500 }}
				>
					<!-- License info -->
					<Card class="border-2 p-6">
						<div class="flex items-start gap-4">
							<div
								class="shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center"
							>
								<MailIcon class="size-5 text-primary" />
							</div>
							<div>
								<h2 class="font-semibold mb-1">
									Check your email
								</h2>
								<p
									class="text-sm text-muted-foreground leading-relaxed"
								>
									Your license key and receipt have been sent
									to your email address. It may take a few
									minutes to arrive.
								</p>
							</div>
						</div>
					</Card>

					<!-- Next steps -->
					<Card class="border-2 p-6">
						<div class="flex items-start gap-4">
							<div
								class="shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center"
							>
								<DownloadIcon class="size-5 text-primary" />
							</div>
							<div class="flex-1">
								<h2 class="font-semibold mb-1">
									Get started
								</h2>
								<p
									class="text-sm text-muted-foreground leading-relaxed mb-4"
								>
									Download Seaquel and activate your license
									key to unlock commercial use.
								</p>
								<DownloadDropdown
									size="sm"
									label="Download Seaquel"
								/>
							</div>
						</div>
					</Card>

					<!-- Support -->
					<Card class="border-2 p-6">
						<div class="flex items-start gap-4">
							<div
								class="shrink-0 size-10 rounded-lg bg-primary/10 flex items-center justify-center"
							>
								<HelpCircleIcon class="size-5 text-primary" />
							</div>
							<div>
								<h2 class="font-semibold mb-1">
									Need help?
								</h2>
								<p
									class="text-sm text-muted-foreground leading-relaxed"
								>
									If you have any issues with your license or
									need assistance, reach out on our
									<a
										href="/discord"
										target="_blank"
										class="text-primary hover:underline"
										>Discord community</a
									>
									or
									<a
										href="https://github.com/webstonehq/seaquel/issues"
										target="_blank"
										class="text-primary hover:underline"
										>open an issue</a
									>.
								</p>
							</div>
						</div>
					</Card>

					{#if sessionId}
						<p class="text-xs text-muted-foreground text-center">
							Session ID: {sessionId}
						</p>
					{/if}
				</div>
			</div>
		</section>

		<FooterSection />
	</div>
</div>
