<script lang="ts">
	import NavHeader from "$lib/components/nav-header.svelte";
	import FooterSection from "$lib/components/footer-section.svelte";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { downloadGroups } from "$lib/downloads";
	import { fly, fade } from "svelte/transition";
	import { DownloadIcon, AppleIcon, MonitorIcon, ExternalLinkIcon } from "lucide-svelte";
	import LogoLinux from "$lib/components/logo-linux.svelte";

	const osIcons = {
		macos: AppleIcon,
		windows: MonitorIcon,
		linux: LogoLinux,
	};
</script>

<svelte:head>
	<title>Download Seaquel - Free Database Client for macOS, Windows & Linux</title>
	<meta name="description" content="Download Seaquel for your platform. Available for macOS (Apple Silicon & Intel), Windows (MSI & EXE), and Linux (DEB, RPM, AppImage)." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<NavHeader />

	<div class="pt-16">
		<!-- Hero Section -->
		<section class="py-20 md:py-28 bg-linear-to-b from-primary/10 via-background to-background">
			<div class="container mx-auto px-4 md:px-6 text-center">
				<div in:fade={{ duration: 600 }}>
					<div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20 mb-6">
						<DownloadIcon class="size-4" />
						<span>Free & Open Source</span>
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
				<div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
					{#each downloadGroups as group, index (group.os)}
						{@const Icon = osIcons[group.os]}
						<div in:fly={{ y: 30, delay: 100 + index * 100, duration: 600 }}>
							<Card class="h-full border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
								<CardHeader class="text-center pb-4">
									<div class="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
										<Icon class="size-8 text-primary" />
									</div>
									<CardTitle class="text-2xl">{group.label}</CardTitle>
								</CardHeader>
								<CardContent class="space-y-3">
									{#each group.options as option (option.id)}
										<Button
											href={option.url}
											variant="outline"
											class="w-full justify-between h-auto py-3 px-4"
										>
											<span class="flex flex-col items-start">
												<span class="font-medium">{option.label}</span>
											</span>
											<span class="flex items-center gap-2 text-muted-foreground">
												<span class="text-xs font-mono bg-muted px-2 py-0.5 rounded">{option.format}</span>
												<DownloadIcon class="size-4" />
											</span>
										</Button>
									{/each}
								</CardContent>
							</Card>
						</div>
					{/each}
				</div>

				<!-- GitHub Releases Link -->
				<div class="text-center mt-12" in:fade={{ delay: 500, duration: 600 }}>
					<p class="text-muted-foreground mb-4">
						Looking for older versions or release notes?
					</p>
					<Button
						href="https://github.com/webstonehq/seaquel/releases"
						variant="ghost"
						class="gap-2"
					>
						<ExternalLinkIcon class="size-4" />
						View all releases on GitHub
					</Button>
				</div>
			</div>
		</section>

		<FooterSection />
	</div>
</div>
