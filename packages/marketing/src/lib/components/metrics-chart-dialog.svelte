<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import { ChartContainer, type ChartConfig } from "$lib/components/ui/chart";
	import { BarChart } from "layerchart";

	let {
		open = $bindable(false),
		title,
		data,
		barColor = "var(--chart-1)",
	}: {
		open: boolean;
		title: string;
		data: { label: string; value: number }[];
		barColor?: string;
	} = $props();

	const chartConfig: ChartConfig = $derived({
		value: {
			label: "Downloads",
			color: barColor,
		},
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[calc(100%-1rem)] sm:max-w-2xl max-h-[90dvh] overflow-x-hidden overflow-y-auto p-4 sm:p-6">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>Downloads broken down by release</Dialog.Description>
		</Dialog.Header>
		<div class="min-w-0 overflow-hidden">
			{#if data.length > 0}
				<ChartContainer config={chartConfig} class="h-[250px] sm:h-[350px] w-full">
					<BarChart
						data={data}
						x="label"
						y="value"
						padding={{ top: 20, right: 10, bottom: 60, left: 40 }}
						props={{
							bars: { fill: barColor, radius: 4 },
							xAxis: { tickLabelProps: { rotate: -45, textAnchor: "end" } },
						}}
					/>
				</ChartContainer>
			{:else}
				<div class="flex h-[250px] sm:h-[350px] items-center justify-center text-muted-foreground">
					No download data available
				</div>
			{/if}
		</div>
	</Dialog.Content>
</Dialog.Root>
