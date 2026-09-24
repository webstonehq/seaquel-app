<script lang="ts">
	interface Props {
		vendor: string;
		verifiedOn: string;
		sources: Record<string, string>;
	}

	let { vendor, verifiedOn, sources }: Props = $props();

	const formatted = $derived(
		new Date(verifiedOn).toLocaleDateString("en-GB", {
			day: "numeric",
			month: "long",
			year: "numeric",
		}),
	);
</script>

<!--
	Printing the verification date is half the point of the page. A test fails
	the build once this passes 180 days, so the date on screen is never older
	than the last time somebody actually re-checked the vendor's pages.
-->
<section class="rounded-xl border border-dashed bg-muted/20 p-6 text-sm">
	<h2 class="mb-2 font-semibold">How this page is kept honest</h2>
	<p class="mb-4 text-muted-foreground leading-relaxed">
		Everything above about {vendor} was checked against their own pages on
		<strong class="text-foreground">{formatted}</strong>. Prices and platform support move
		around. If something here is out of date,
		<a href="/feedback" class="text-primary hover:underline">tell me</a> and I'll fix it.
	</p>
	<h3 class="mb-2 font-medium text-muted-foreground text-xs uppercase tracking-wide">Sources</h3>
	<ul class="flex flex-wrap gap-x-4 gap-y-1">
		{#each Object.entries(sources) as [label, url]}
			<li>
				<a
					href={url}
					target="_blank"
					rel="nofollow noopener"
					class="text-primary text-xs hover:underline">{label}</a
				>
			</li>
		{/each}
	</ul>
</section>
