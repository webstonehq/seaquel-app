<script lang="ts">
	import { CheckIcon } from "lucide-svelte";

	interface Props {
		competitor: string;
		chooseSeaquel: string[];
		chooseThem: string[];
	}

	let { competitor, chooseSeaquel, chooseThem }: Props = $props();
</script>

<!--
	Above the fold and deliberately two-sided. This is the block an AI answer
	lifts when it summarises the page, so it carries the honest verdict rather
	than a pitch.
-->
<section class="grid gap-4 md:grid-cols-2">
	<div class="rounded-xl border-2 border-primary/30 bg-primary/5 p-6">
		<h2 class="mb-4 font-semibold text-lg">
			Choose <span class="text-primary">Seaquel</span> if
		</h2>
		<ul class="space-y-3">
			{#each chooseSeaquel as reason}
				<li class="flex gap-3 text-sm md:text-base">
					<CheckIcon class="mt-0.5 size-4 shrink-0 text-primary" />
					<span>{reason}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="rounded-xl border-2 bg-card p-6">
		<h2 class="mb-4 font-semibold text-lg">Choose {competitor} if</h2>
		<ul class="space-y-3">
			{#each chooseThem as reason}
				<li class="flex gap-3 text-sm md:text-base">
					<CheckIcon class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
					<span>{reason}</span>
				</li>
			{/each}
		</ul>
	</div>
</section>
