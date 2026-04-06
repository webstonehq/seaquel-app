<script lang="ts">
    import { MousePointerClickIcon, Maximize2Icon } from "lucide-svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import FullscreenOverlay from "./fullscreen-overlay.svelte";

    let {
        hash = "fullscreen",
        hintText = "Live app — click to explore",
        mode,
        autoOpen = false,
    }: {
        hash?: string;
        hintText?: string;
        mode?: string;
        autoOpen?: boolean;
    } = $props();

    let showCursorHint = $state(true);
    let theaterMode = $state(false);
    let iframeRef: HTMLIFrameElement;

    // Build demo iframe src with optional mode param
    let demoSrc = $state("/demo/");

    onMount(() => {
        const urlMode = mode ?? new URLSearchParams(window.location.search).get("mode");
        if (urlMode) {
            demoSrc = `/demo/?mode=${encodeURIComponent(urlMode)}`;
        }

        if (autoOpen || window.location.hash === `#${hash}`) {
            openTheater();
        }
    });

    function dismissHint() {
        showCursorHint = false;
        iframeRef?.focus();
    }

    function openTheater() {
        dismissHint();
        theaterMode = true;
        history.replaceState(null, '', `#${hash}`);
    }

    function onTheaterClose() {
        history.replaceState(null, '', window.location.pathname);
    }
</script>

<div class="relative group w-full">
    <!-- Glow effect -->
    <div
        class="absolute -inset-1 bg-linear-to-r from-primary via-accent to-primary rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
    ></div>

    <div
        class="relative rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl bg-card"
    >
        {#if showCursorHint}
            <button
                class="absolute inset-0 flex items-center justify-center z-10 cursor-pointer bg-transparent border-0"
                transition:fade={{ duration: 300 }}
                onclick={dismissHint}
                aria-label="Click to interact with demo"
            >
                <div class="flex items-center gap-2 animate-bounce">
                    <MousePointerClickIcon class="size-12 text-primary drop-shadow-lg" />
                    <span class="text-sm font-medium text-foreground bg-background/80 px-3 py-1.5 rounded-full shadow-lg">
                        {hintText}
                    </span>
                </div>
            </button>
        {/if}

        <!-- Expand button -->
        <button
            class="absolute top-3 right-3 z-20 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background hover:border-primary/50 cursor-pointer"
            onclick={openTheater}
            aria-label="Expand demo to fullscreen"
        >
            <Maximize2Icon class="size-4 text-foreground" />
        </button>

        <iframe
            bind:this={iframeRef}
            src={demoSrc}
            title="Seaquel Demo - Interactive Database Client"
            class="w-full aspect-video border-0"
            loading="lazy"
        ></iframe>
    </div>
</div>

<p class="text-sm text-muted-foreground mt-4">
    Click anywhere to start exploring · <button class="underline hover:text-foreground transition-colors cursor-pointer" onclick={openTheater}>Open fullscreen</button>
</p>

<FullscreenOverlay bind:open={theaterMode} onclose={onTheaterClose}>
    <iframe
        src={demoSrc}
        title="Seaquel Demo - Interactive Database Client (Fullscreen)"
        class="w-full h-full border-0"
    ></iframe>
</FullscreenOverlay>
