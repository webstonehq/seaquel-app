<script lang="ts">
	import {
		ArrowRightIcon,
		CircleCheckIcon,
		CircleXIcon,
		Loader2Icon,
		PlayIcon,
		RotateCcwIcon
	} from "lucide-svelte";
	import { getDatabase, runQuery, type RunResult } from "$lib/sql-errors/sandbox";

	interface Props {
		broken: string;
		fixed: string;
	}

	let { broken, fixed }: Props = $props();

	type Tab = "broken" | "fixed";

	const ROW_LIMIT = 50;

	// Edits are kept per tab, so flipping back and forth doesn't lose work.
	// Props are fixed per page, so reading them once here is intentional.
	// svelte-ignore state_referenced_locally
	let sql = $state<Record<Tab, string>>({ broken, fixed });
	let results = $state<Record<Tab, RunResult | null>>({ broken: null, fixed: null });
	let active = $state<Tab>("broken");
	let running = $state(false);
	let starting = $state(false);

	const result = $derived(results[active]);
	const edited = $derived(sql[active] !== (active === "broken" ? broken : fixed));

	// Start fetching Postgres as soon as the reader shows interest, so the first
	// click on Run doesn't pay the whole download.
	function warmUp() {
		getDatabase().catch(() => {});
	}

	async function run(tab: Tab = active) {
		if (running) return;
		active = tab;
		running = true;
		starting = true;
		try {
			await getDatabase();
			starting = false;
			results[tab] = await runQuery(sql[tab]);
		} catch (err) {
			results[tab] = {
				ok: false,
				message: `The sandbox couldn't start: ${(err as Error).message ?? err}`,
				elapsed: 0
			};
		} finally {
			running = false;
			starting = false;
		}
	}

	function reset() {
		sql[active] = active === "broken" ? broken : fixed;
		results[active] = null;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
			event.preventDefault();
			run();
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
	class="rounded-lg border bg-card shadow-sm overflow-hidden"
	onpointerenter={warmUp}
	onfocusin={warmUp}
	role="group"
	aria-label="SQL sandbox"
>
	<div class="flex flex-wrap items-center justify-between gap-2 border-b bg-muted/40 px-2 py-2">
		<div class="flex gap-1" role="tablist" aria-label="Query version">
			{#each [["broken", "Broken query"], ["fixed", "Fixed query"]] as [tab, label], index (tab)}
				<button
					type="button"
					role="tab"
					aria-selected={active === tab}
					class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer {active ===
					tab
						? 'bg-background shadow-sm border text-foreground'
						: 'text-muted-foreground hover:text-foreground border border-transparent'}"
					onclick={() => (active = tab as Tab)}
				>
					{#if tab === "broken"}
						<CircleXIcon class="size-3.5 text-red-500" />
					{:else}
						<CircleCheckIcon class="size-3.5 text-green-500" />
					{/if}
					<span class="text-muted-foreground">{index + 1}.</span>
					{label}
				</button>
			{/each}
		</div>
		<div class="flex items-center gap-1">
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
			<button
				type="button"
				class="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
				onclick={() => run()}
				disabled={running}
			>
				{#if running}
					<Loader2Icon class="size-3.5 animate-spin" />
					{starting ? "Starting Postgres…" : "Running…"}
				{:else}
					<PlayIcon class="size-3.5" />
					Run
				{/if}
			</button>
		</div>
	</div>

	<textarea
		bind:value={sql[active]}
		onkeydown={onKeydown}
		spellcheck="false"
		autocapitalize="off"
		autocomplete="off"
		aria-label="{active === 'broken' ? 'Broken' : 'Fixed'} SQL query"
		rows={Math.min(14, Math.max(4, sql[active].split("\n").length + 1))}
		class="block w-full resize-y bg-background px-4 py-3 font-mono text-sm leading-relaxed text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40"
	></textarea>

	<div class="border-t min-h-24 text-sm" aria-live="polite">
		{#if !result}
			<p class="px-4 py-6 text-muted-foreground">
				Press <strong class="font-medium text-foreground">Run</strong>
				(or <kbd class="rounded border bg-muted px-1 text-xs">⌘/Ctrl</kbd> +
				<kbd class="rounded border bg-muted px-1 text-xs">Enter</kbd>) to execute this against a
				real PostgreSQL database in your browser. Nothing is sent to a server.
			</p>
		{:else if !result.ok}
			<div class="px-4 py-4 bg-red-500/5">
				<div class="flex items-start gap-2 font-mono text-red-600 dark:text-red-400 break-words">
					<CircleXIcon class="size-4 mt-0.5 shrink-0" />
					<span><span class="font-semibold">ERROR:</span> {result.message}</span>
				</div>
				{#if result.hint}
					<p class="mt-1 pl-6 font-mono text-muted-foreground break-words">HINT: {result.hint}</p>
				{/if}
				{#if active === "broken"}
					<button
						type="button"
						class="mt-4 ml-6 inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
						onclick={() => run("fixed")}
					>
						Run the fixed query
						<ArrowRightIcon class="size-3.5" />
					</button>
				{/if}
			</div>
		{:else}
			<div
				class="flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground border-b bg-green-500/5"
			>
				<CircleCheckIcon class="size-3.5 text-green-500" />
				{result.rowCount}
				{result.rowCount === 1 ? "row" : "rows"} in {result.elapsed.toFixed(1)} ms
				{#if result.rows.length > ROW_LIMIT}
					· showing the first {ROW_LIMIT}
				{/if}
			</div>
			{#if result.columns.length > 0}
				<div class="overflow-x-auto max-h-80">
					<table class="w-full text-left font-mono text-xs">
						<thead class="sticky top-0 bg-muted">
							<tr>
								{#each result.columns as column, i (i)}
									<th class="px-4 py-2 font-semibold whitespace-nowrap">{column}</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each result.rows.slice(0, ROW_LIMIT) as row, r (r)}
								<tr class="border-t">
									{#each row as cell, c (c)}
										<td
											class="px-4 py-1.5 whitespace-nowrap {cell === null
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
		{/if}
	</div>
</div>
