<script lang="ts">
	import { CheckIcon, ExternalLinkIcon, XIcon } from "lucide-svelte";
	import type { CellValue, ComparisonRow } from "$lib/competitors";

	interface Props {
		competitor: string;
		rows: ComparisonRow[];
		verifiedOn: string;
	}

	let { competitor, rows, verifiedOn }: Props = $props();

	const formatted = $derived(
		new Date(verifiedOn).toLocaleDateString("en-GB", {
			day: "numeric",
			month: "long",
			year: "numeric",
		}),
	);
</script>

{#snippet cell(value: CellValue, emphasis: boolean)}
	{#if typeof value === "boolean"}
		{#if value}
			<CheckIcon class="size-5 text-green-600 dark:text-green-500" />
		{:else}
			<XIcon class="size-5 text-muted-foreground/60" />
		{/if}
	{:else}
		<span class="text-sm {emphasis ? 'font-medium text-primary' : 'text-muted-foreground'}">
			{value}
		</span>
	{/if}
{/snippet}

<section>
	<h2 class="mb-2 font-bold text-2xl tracking-tight md:text-3xl">
		Seaquel vs {competitor}, feature by feature
	</h2>
	<p class="mb-6 text-muted-foreground">
		Every row links to the source it was checked against. Last verified {formatted}.
	</p>

	<div class="overflow-hidden rounded-xl border bg-card">
		<div class="grid grid-cols-[1.4fr_1fr_1fr] border-b bg-muted/50">
			<div class="p-4 font-semibold text-sm">Feature</div>
			<div class="border-x p-4 text-center font-semibold text-primary text-sm">Seaquel</div>
			<div class="p-4 text-center font-semibold text-sm">{competitor}</div>
		</div>

		{#each rows as row}
			<div class="border-b last:border-b-0">
				<div class="grid grid-cols-[1.4fr_1fr_1fr]">
					<div class="flex items-center p-4 text-sm">
						{row.feature}
					</div>
					<div class="flex items-center justify-center border-x bg-primary/5 p-4 text-center">
						{@render cell(row.seaquel, true)}
					</div>
					<div class="flex items-center justify-center gap-1.5 p-4 text-center">
						{@render cell(row.them, false)}
						<!--
							Sits against the competitor's value because that is what it
							verifies. Sourcing our own column would be circular.
						-->
						<a
							href={row.source}
							target="_blank"
							rel="nofollow noopener"
							class="shrink-0 text-muted-foreground/60 transition-colors hover:text-foreground"
							title="Where I checked this"
							aria-label="Source for {competitor}: {row.feature}"
						>
							<ExternalLinkIcon class="size-3.5" />
						</a>
					</div>
				</div>
				{#if row.note}
					<p class="border-t bg-muted/20 px-4 py-2 text-muted-foreground text-xs leading-relaxed">
						{row.note}
					</p>
				{/if}
			</div>
		{/each}
	</div>
</section>
