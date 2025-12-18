<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from "mode-watcher";

	let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
    <title>Seaquel - Database Management, Reimagined</title>
    <meta name="description" content="Lightning-fast, resource-efficient database client with AI-powered assistance. Work offline, query smarter, and manage your data with unprecedented speed.">
</svelte:head>

<ModeWatcher />
{@render children()}
