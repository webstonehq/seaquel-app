<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { fly } from "svelte/transition";
	import type { Component, ComponentType, SvelteComponent } from "svelte";

	interface Feature {
		icon: Component<any> | ComponentType<SvelteComponent<any>>;
		title: string;
		description: string;
	}

	interface Props {
		title: string;
		description: string;
		features: Feature[];
		variant?: "default" | "highlight";
	}

	let { title, description, features, variant = "default" }: Props = $props();
</script>

<section class="py-16 {variant === 'highlight' ? 'bg-muted/30' : ''}">
	<div class="container mx-auto px-4 md:px-6">
		<div class="mb-10">
			<h2 class="text-2xl md:text-3xl font-bold tracking-tight mb-2">{title}</h2>
			<p class="text-muted-foreground">{description}</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each features as feature, index}
				<div in:fly={{ y: 20, delay: index * 50, duration: 400 }}>
					<Card class="h-full border hover:border-primary/30 hover:shadow-md transition-all duration-200">
						<CardHeader class="pb-3">
							<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
								<feature.icon class="size-5 text-primary" />
							</div>
							<CardTitle class="text-lg">{feature.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<CardDescription class="text-sm leading-relaxed">
								{feature.description}
							</CardDescription>
						</CardContent>
					</Card>
				</div>
			{/each}
		</div>
	</div>
</section>
