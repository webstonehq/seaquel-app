<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { CalendarIcon, ClockIcon, ArrowRightIcon } from "lucide-svelte";
	import type { BlogEntry } from "$lib/blog";
	import authorAvatar from "$lib/assets/mike_headshot.webp";

	let { entry }: { entry: BlogEntry } = $props();
</script>

<a href="/blog/{entry.slug}" class="group block h-full">
	<Card class="h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
		<CardHeader>
			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<div class="inline-flex items-center gap-1.5">
					<CalendarIcon class="size-3.5" />
					<time datetime={entry.date}>{entry.dateFormatted}</time>
				</div>
				<div class="inline-flex items-center gap-1.5">
					<ClockIcon class="size-3.5" />
					<span>{entry.readTime}</span>
				</div>
			</div>
			<CardTitle class="text-xl leading-snug group-hover:text-primary transition-colors flex items-start gap-2">
				<span>{entry.title}</span>
				<ArrowRightIcon class="size-4 mt-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
			</CardTitle>
		</CardHeader>
		<CardContent class="flex flex-col flex-1">
			<p class="text-sm text-muted-foreground mb-4 line-clamp-3">{entry.description}</p>
			<div class="flex items-center gap-2.5 mt-auto pt-4 border-t">
				<enhanced:img
					src={authorAvatar}
					alt={entry.author.name}
					class="size-8 rounded-full object-cover"
				/>
				<div class="flex flex-col leading-tight">
					<span class="text-sm font-medium">{entry.author.name}</span>
					<span class="text-xs text-muted-foreground">{entry.author.role}</span>
				</div>
			</div>
		</CardContent>
	</Card>
</a>
