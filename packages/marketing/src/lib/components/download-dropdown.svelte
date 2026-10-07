<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import * as DropdownMenu from "#lib/components/ui/dropdown-menu/index.js";
	import { downloadGroups } from "#lib/downloads.js";
	import DownloadIcon from "@lucide/svelte/icons/download";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import { cn } from "#lib/utils.js";

	interface Props {
		variant?: "default" | "outline" | "ghost";
		size?: "default" | "sm" | "lg" | "icon";
		class?: string;
		label?: string;
		/** Lifetime installer downloads, shown as a compact count next to the label. */
		downloads?: number | null;
	}

	let { variant = "default", size = "default", class: className = "", label = "Download", downloads = null }: Props = $props();

	const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} {variant} {size} class={cn("gap-2", className)}>
				<DownloadIcon class="size-4" />
				{label}
				{#if downloads}
					<span
						class="rounded-full bg-white/40 px-2 py-0.5 text-xs font-semibold tabular-nums"
						title="{downloads.toLocaleString('en-US')} downloads"
					>
						{compact.format(downloads).toLowerCase()}<span class="sr-only"> downloads</span>
					</span>
				{/if}
				<ChevronDownIcon class="size-3 opacity-60" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-64" align="end">
		{#each downloadGroups as group, groupIndex (group.os)}
			{#if groupIndex > 0}
				<DropdownMenu.Separator />
			{/if}
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>{group.label}</DropdownMenu.GroupHeading>
				{#each group.options as option (option.id)}
					<a href={option.url} class="block">
						<DropdownMenu.Item class="flex justify-between cursor-pointer">
							<span>{option.label}</span>
							<span class="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{option.format}</span>
						</DropdownMenu.Item>
					</a>
				{/each}
			</DropdownMenu.Group>
		{/each}
		<DropdownMenu.Separator />
		<a href="/download" class="block">
			<DropdownMenu.Item class="cursor-pointer">
				<ExternalLinkIcon class="size-4 mr-2" />
				All downloads...
			</DropdownMenu.Item>
		</a>
	</DropdownMenu.Content>
</DropdownMenu.Root>
