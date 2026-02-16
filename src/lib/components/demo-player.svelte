<script lang="ts">
    import { MousePointerClickIcon, Maximize2Icon, XIcon } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import { onMount } from "svelte";

    let {
        hash = "demo",
        hintText = "Live app — click to explore",
    }: {
        hash?: string;
        hintText?: string;
    } = $props();

    let showCursorHint = $state(true);
    let theaterMode = $state(false);
    let iframeRef: HTMLIFrameElement;

    onMount(() => {
        if (window.location.hash === `#${hash}`) {
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
        document.body.style.overflow = 'hidden';
        history.replaceState(null, '', `#${hash}`);
    }

    function closeTheater() {
        theaterMode = false;
        document.body.style.overflow = '';
        history.replaceState(null, '', window.location.pathname);
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && theaterMode) {
            closeTheater();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

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
            src="/demo/"
            title="Seaquel Demo - Interactive Database Client"
            class="w-full aspect-video border-0"
            loading="lazy"
        ></iframe>
    </div>
</div>

<p class="text-sm text-muted-foreground mt-4">
    Click anywhere to start exploring · <button class="underline hover:text-foreground transition-colors cursor-pointer" onclick={openTheater}>Open fullscreen</button>
</p>

<!-- Theater Mode Overlay -->
{#if theaterMode}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Demo in fullscreen mode"
    >
        <!-- Backdrop -->
        <button
            class="absolute inset-0 bg-black/90 backdrop-blur-md cursor-default border-0"
            onclick={closeTheater}
            aria-label="Close fullscreen demo"
            transition:fade={{ duration: 300 }}
        ></button>

        <!-- Demo container -->
        <div
            class="relative w-[95vw] h-[90vh] max-w-[1800px]"
            transition:scale={{ duration: 400, easing: cubicOut, start: 0.8 }}
        >
            <!-- Amplified glow effect -->
            <div
                class="absolute -inset-2 bg-linear-to-r from-primary via-accent to-primary rounded-2xl blur-3xl opacity-40"
            ></div>

            <!-- Close button -->
            <button
                class="absolute -top-12 right-0 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                onclick={closeTheater}
            >
                <span class="text-sm">Close</span>
                <XIcon class="size-4" />
            </button>

            <!-- Click outside hint -->
            <p class="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-white/50">
                Click outside to close
            </p>

            <!-- Demo frame -->
            <div class="relative w-full h-full rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl bg-card">
                <iframe
                    src="/demo/"
                    title="Seaquel Demo - Interactive Database Client (Fullscreen)"
                    class="w-full h-full border-0"
                ></iframe>
            </div>
        </div>
    </div>
{/if}
