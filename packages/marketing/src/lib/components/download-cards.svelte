<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { downloadGroups } from "$lib/downloads";
	import { fly } from "svelte/transition";
	import DownloadIcon from "@lucide/svelte/icons/download";
	import AppleIcon from "@lucide/svelte/icons/apple";
	import MonitorIcon from "@lucide/svelte/icons/monitor";
	import LogoLinux from "$lib/components/logo-linux.svelte";

	interface Props {
		/** Where the per-platform links live: `/download` or `/download/beta`. */
		basePath?: string;
	}

	let { basePath = "/download" }: Props = $props();

	const osIcons = {
		macos: AppleIcon,
		windows: MonitorIcon,
		linux: LogoLinux,
	};
</script>

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
							href="{basePath}/{option.id}"
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
