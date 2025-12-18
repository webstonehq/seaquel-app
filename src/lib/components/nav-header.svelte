<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import ThemeToggle from "$lib/components/theme-toggle.svelte";
	import { DiscIcon, GithubIcon } from "lucide-svelte";
    import Logo from "./logo.svelte";
</script>

<header class="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
	<div class="container mx-auto px-4 md:px-6">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
				<Logo class="size-8 text-primary" />
				<span class="text-xl font-bold">Seaquel</span>
			</a>

			<!-- Navigation -->
			<nav class="hidden md:flex items-center gap-6">
				<a href="#features" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
				<!-- <a href="#download" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Download</a>
				<a href="#docs" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Docs</a> -->
			</nav>

			<!-- Actions -->
			<div class="flex items-center gap-2">
				<!-- <Button variant="ghost" size="icon" class="size-9 rounded-lg">
					<GithubIcon class="size-5" />
					<span class="sr-only">GitHub</span>
				</Button> -->
				<ThemeToggle />
			</div>
		</div>
	</div>
</header>
