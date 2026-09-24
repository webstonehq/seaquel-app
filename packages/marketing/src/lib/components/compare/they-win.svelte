<script lang="ts">
	import type { Concession } from "$lib/competitors";

	interface Props {
		competitor: string;
		concessions: Concession[];
	}

	let { competitor, concessions }: Props = $props();
</script>

<!--
	Given the same visual weight as the comparison table on purpose. A page that
	concedes nothing is not believed, and this section is what buys the rest of
	the page its credibility. `content.test.ts` enforces a minimum of three.
-->
<section>
	<h2 class="mb-2 font-bold text-2xl tracking-tight md:text-3xl">
		Where {competitor} is better
	</h2>
	<p class="mb-6 text-muted-foreground">
		Reasons to pick {competitor} over Seaquel.
	</p>

	<div class="grid gap-4 md:grid-cols-2">
		{#each concessions as concession}
			<div class="rounded-xl border bg-card p-5">
				<h3 class="mb-2 font-semibold">{concession.title}</h3>
				<p class="text-muted-foreground text-sm leading-relaxed">{concession.body}</p>
			</div>
		{/each}
	</div>
</section>
