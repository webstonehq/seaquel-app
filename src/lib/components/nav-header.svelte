<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import ThemeToggle from "$lib/components/theme-toggle.svelte";
	import { GithubIcon, DownloadIcon, MenuIcon, XIcon } from "lucide-svelte";
	import { onMount } from "svelte";
	import { detectPlatform, detectArchitecture, getDownloadUrl, type Platform, type Architecture } from "$lib/utils";
	import Logo from "./logo.svelte";

	let mobileMenuOpen = $state(false);
	let platform: Platform = $state("unknown");
	let arch: Architecture = $state("unknown");
	let downloadUrl = $derived(getDownloadUrl(platform, arch));

	onMount(() => {
		platform = detectPlatform();
		arch = detectArchitecture();
	});
</script>

<header class="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
	<div class="container mx-auto px-4 md:px-6">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
				<Logo class="size-8 text-primary" />
				<span class="text-xl font-bold">Seaquel</span>
			</a>

			<!-- Navigation - Desktop -->
			<nav class="hidden md:flex items-center gap-6">
				<a href="/features" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
				<a href="/changelog" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Changelog</a>
				<a href="https://github.com/webstonehq/seaquel" target="_blank" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
					<GithubIcon class="size-4" />
					GitHub
				</a>
			</nav>

			<!-- Actions -->
			<div class="flex items-center gap-3">
				<ThemeToggle />

				<!-- Download CTA - Desktop Only -->
				<Button
					href={downloadUrl}
					size="sm"
					class="hidden md:inline-flex gap-2"
				>
					<DownloadIcon class="size-4" />
					Download
				</Button>

				<!-- Mobile Menu Toggle -->
				<Button
					variant="ghost"
					size="icon"
					class="md:hidden"
					onclick={() => mobileMenuOpen = !mobileMenuOpen}
				>
					{#if mobileMenuOpen}
						<XIcon class="size-5" />
					{:else}
						<MenuIcon class="size-5" />
					{/if}
				</Button>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden py-4 border-t">
				<nav class="flex flex-col gap-4">
					<a href="/#features" class="text-sm font-medium" onclick={() => mobileMenuOpen = false}>Features</a>
					<a href="/features" class="text-sm font-medium" onclick={() => mobileMenuOpen = false}>All Features</a>
					<a href="https://github.com/webstonehq/seaquel" target="_blank" class="text-sm font-medium flex items-center gap-2">
						<GithubIcon class="size-4" />
						GitHub
					</a>
					<Button href={downloadUrl} class="w-full gap-2">
						<DownloadIcon class="size-4" />
						Download for Free
					</Button>
				</nav>
			</div>
		{/if}
	</div>
</header>
