<script lang="ts">
	import {
		CircleCheckIcon,
		CircleXIcon,
		LightbulbIcon,
		Loader2Icon,
		PlayIcon,
		RotateCcwIcon
	} from "lucide-svelte";
	import { getDatabase, gradeChallenge, type Grade } from "$lib/sandbox";
	import type { Challenge } from "$lib/learn-sql/challenges";

	interface Props {
		challenge: Challenge;
		index: number;
		solved: boolean;
		onsolved: (id: string) => void;
	}

	let { challenge, index, solved, onsolved }: Props = $props();

	const ROW_LIMIT = 20;

	// svelte-ignore state_referenced_locally
	let sql = $state(challenge.starter ?? "");
	let grade = $state<Grade | null>(null);
	let running = $state(false);
	let starting = $state(false);
	let showHint = $state(false);
	let showSolution = $state(false);

	const edited = $derived(sql !== (challenge.starter ?? ""));

	function warmUp() {
		getDatabase().catch(() => {});
	}

	async function check() {
		if (running) return;
		running = true;
		starting = true;
		try {
			await getDatabase();
			starting = false;
			grade = await gradeChallenge(sql, {
				solution: challenge.solution,
				ordered: challenge.ordered
			});
			if (grade.status === "correct") onsolved(challenge.id);
		} catch (err) {
			grade = {
				status: "error",
				message: `The sandbox couldn't start: ${(err as Error).message ?? err}`
			};
		} finally {
			running = false;
			starting = false;
		}
	}

	function reset() {
		sql = challenge.starter ?? "";
		grade = null;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			check();
		}
	}

	function formatCell(value: unknown): string {
		if (value === null || value === undefined) return "NULL";
		if (value instanceof Date) return value.toISOString().replace("T", " ").replace(/\.000Z$/, "");
		if (typeof value === "object") return JSON.stringify(value);
		return String(value);
	}
</script>

<div
	class="rounded-lg border bg-card shadow-sm overflow-hidden {solved
		? 'border-green-500/40'
		: ''}"
	onpointerenter={warmUp}
	onfocusin={warmUp}
	role="group"
	aria-label="Challenge {index + 1}"
>
	<div class="flex items-start gap-3 border-b bg-muted/40 px-4 py-3">
		<span
			class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold {solved
				? 'bg-green-500 text-white'
				: 'bg-primary/10 text-primary ring-1 ring-primary/20'}"
		>
			{#if solved}✓{:else}{index + 1}{/if}
		</span>
		<p class="text-sm font-medium leading-relaxed">{challenge.prompt}</p>
	</div>

	<textarea
		bind:value={sql}
		onkeydown={onKeydown}
		spellcheck="false"
		autocapitalize="off"
		autocomplete="off"
		placeholder="Write your query here…"
		aria-label="Your SQL for challenge {index + 1}"
		rows={Math.min(12, Math.max(4, sql.split("\n").length + 1))}
		class="block w-full resize-y bg-background px-4 py-3 font-mono text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
	></textarea>

	<div class="flex flex-wrap items-center justify-between gap-2 border-t px-2 py-2">
		<div class="flex items-center gap-1">
			<button
				type="button"
				class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
				onclick={() => (showHint = !showHint)}
			>
				<LightbulbIcon class="size-3.5" />
				{showHint ? "Hide hint" : "Hint"}
			</button>
			{#if edited}
				<button
					type="button"
					class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
					onclick={reset}
				>
					<RotateCcwIcon class="size-3.5" />
					Reset
				</button>
			{/if}
		</div>
		<button
			type="button"
			class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
			onclick={check}
			disabled={running}
		>
			{#if running}
				<Loader2Icon class="size-3.5 animate-spin" />
				{starting ? "Starting Postgres…" : "Checking…"}
			{:else}
				<PlayIcon class="size-3.5" />
				Run and check
			{/if}
		</button>
	</div>

	{#if showHint}
		<p class="border-t bg-amber-500/5 px-4 py-3 text-sm text-muted-foreground">
			{challenge.hint}
		</p>
	{/if}

	<div aria-live="polite">
		{#if grade?.status === "error"}
			<div class="border-t bg-red-500/5 px-4 py-3 text-sm">
				<div class="flex items-start gap-2 font-mono text-red-600 dark:text-red-400 break-words">
					<CircleXIcon class="size-4 mt-0.5 shrink-0" />
					<span><span class="font-semibold">ERROR:</span> {grade.message}</span>
				</div>
				{#if grade.hint}
					<p class="mt-1 pl-6 font-mono text-muted-foreground break-words">HINT: {grade.hint}</p>
				{/if}
			</div>
		{:else if grade?.status === "wrong"}
			<div class="border-t bg-amber-500/5 px-4 py-3 text-sm">
				<div class="flex items-start gap-2 text-amber-700 dark:text-amber-400">
					<CircleXIcon class="size-4 mt-0.5 shrink-0" />
					<span>Not quite. {grade.reason}</span>
				</div>
				<button
					type="button"
					class="mt-3 ml-6 text-sm text-primary hover:underline cursor-pointer"
					onclick={() => (showSolution = !showSolution)}
				>
					{showSolution ? "Hide the answer" : "Show me the answer"}
				</button>
				{#if showSolution}
					<pre
						class="mt-2 ml-6 overflow-x-auto rounded-md border bg-muted px-3 py-2 font-mono text-xs">{challenge.solution}</pre>
				{/if}
			</div>
		{:else if grade?.status === "correct"}
			<div class="border-t bg-green-500/5 px-4 py-3 text-sm">
				<div class="flex items-start gap-2 text-green-700 dark:text-green-400">
					<CircleCheckIcon class="size-4 mt-0.5 shrink-0" />
					<span class="font-medium">Correct.</span>
				</div>
				<p class="mt-1 pl-6 text-muted-foreground">{challenge.explanation}</p>
				{#if grade.result.columns.length > 0}
					<div class="mt-3 ml-6 overflow-x-auto rounded-md border max-h-64">
						<table class="w-full text-left font-mono text-xs">
							<thead class="sticky top-0 bg-muted">
								<tr>
									{#each grade.result.columns as column, i (i)}
										<th class="px-3 py-1.5 font-semibold whitespace-nowrap">{column}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each grade.result.rows.slice(0, ROW_LIMIT) as row, r (r)}
									<tr class="border-t">
										{#each row as cell, c (c)}
											<td
												class="px-3 py-1 whitespace-nowrap {cell === null
													? 'text-muted-foreground italic'
													: ''}">{formatCell(cell)}</td
											>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
