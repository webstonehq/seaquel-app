<script lang="ts">
	import DownloadStarted from "$lib/components/download-started.svelte";

	let { data } = $props();
</script>

<DownloadStarted {data} />
