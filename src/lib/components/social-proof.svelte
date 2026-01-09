<script lang="ts">
	import { GithubIcon, StarIcon, GitForkIcon, UsersIcon } from "lucide-svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";

	let stars = $state(0);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch("https://api.github.com/repos/webstonehq/seaquel");
			const data = await res.json();
			stars = data.stargazers_count || 0;
		} catch {
			stars = 0;
		} finally {
			isLoading = false;
		}
	});
</script>

<section class="py-8 border-y bg-muted/20" in:fade={{ delay: 900, duration: 600 }}>
	<div class="container mx-auto px-4 md:px-6">
		<div class="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-16">
			<!-- GitHub Stars (Real-time) -->
			<a
				href="https://github.com/webstonehq/seaquel"
				target="_blank"
				class="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
			>
				<div class="flex items-center gap-2">
					<GithubIcon class="size-5" />
					<StarIcon class="size-4 text-yellow-500 fill-yellow-500" />
				</div>
				<span class="font-medium">
					{#if isLoading}
						<span class="animate-pulse">...</span>
					{:else if stars > 0}
						{stars.toLocaleString()} stars on GitHub
					{:else}
						Star on GitHub
					{/if}
				</span>
			</a>

			<!-- Open Source Badge -->
			<div class="flex items-center gap-2 text-muted-foreground">
				<GitForkIcon class="size-5" />
				<span class="font-medium">100% Open Source</span>
			</div>

			<!-- Made By Developers -->
			<div class="flex items-center gap-2 text-muted-foreground">
				<UsersIcon class="size-5" />
				<span class="font-medium">Made by developers, for developers</span>
			</div>
		</div>
	</div>
</section>
