<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import DownloadDropdown from "$lib/components/download-dropdown.svelte";
    import { GithubIcon, HeartIcon, MousePointerClickIcon, Maximize2Icon, XIcon } from "lucide-svelte";
    import { fly, fade, scale } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let showCursorHint = $state(true);
    let theaterMode = $state(false);
    let iframeRef: HTMLIFrameElement;

    function dismissHint() {
        showCursorHint = false;
        // Focus the iframe so user can interact immediately
        iframeRef?.focus();
    }

    function openTheater() {
        dismissHint();
        theaterMode = true;
        // Prevent body scroll when theater is open
        document.body.style.overflow = 'hidden';
    }

    function closeTheater() {
        theaterMode = false;
        document.body.style.overflow = '';
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && theaterMode) {
            closeTheater();
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<section
    class="relative overflow-hidden bg-linear-to-br from-primary/10 via-accent/5 to-background py-20 md:py-32"
>
    <!-- Decorative background elements -->
    <div
        class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"
    ></div>
    <div
        class="absolute inset-0 bg-grid-white/5 mask-[radial-gradient(ellipse_at_center,transparent_20%,black)]"
    ></div>

    <div class="container relative mx-auto px-4 md:px-6">
        <div class="flex flex-col items-center text-center space-y-8">
            <!-- Badge -->
            <div in:fade={{ delay: 100, duration: 600 }}>
                <div
                    class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20"
                >
                    <HeartIcon class="size-4" />
                    <span>Free & Open Source</span>
                </div>
            </div>

            <!-- Main headline -->
            <div
                class="flex flex-col gap-4 max-w-4xl"
                in:fly={{ y: 20, delay: 200, duration: 600 }}
            >
                <h1
                    class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                >
                    The Database Client
                    <span
                        class="bg-linear-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent"
                        >Developers Actually Want</span
                    >
                </h1>
                <p
                    class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    Lightning-fast, resource-efficient database client with
                    AI-powered assistance. Work offline, query smarter, and
                    manage your data with unprecedented speed.
                </p>
            </div>

            <!-- CTA buttons -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4" in:fly={{ y: 20, delay: 400, duration: 600 }}>
                <DownloadDropdown size="lg" class="text-base px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" />
                <Button href="https://github.com/webstonehq/seaquel" size="lg" variant="outline" class="text-base px-8">
                    <GithubIcon class="mr-2" />
                    View on GitHub
                </Button>
            </div>

            <!-- Stats or trust indicators -->
            <div
                class="grid grid-cols-3 gap-8 pt-12 max-w-2xl w-full"
                in:fade={{ delay: 600, duration: 600 }}
            >
                <div class="space-y-1">
                    <div class="text-3xl md:text-4xl font-bold text-primary">
                        10x
                    </div>
                    <div class="text-sm text-muted-foreground">
                        More Efficient
                    </div>
                    <div class="text-xs text-muted-foreground/60">
                        vs. Electron apps
                    </div>
                </div>
                <div class="space-y-1">
                    <div class="text-3xl md:text-4xl font-bold text-primary">
                        50%
                    </div>
                    <div class="text-sm text-muted-foreground">Less Memory</div>
                    <div class="text-xs text-muted-foreground/60">
                        vs. DBeaver
                    </div>
                </div>
                <div class="space-y-1">
                    <div class="text-3xl md:text-4xl font-bold text-primary">
                        100%
                    </div>
                    <div class="text-sm text-muted-foreground">
                        Offline Ready
                    </div>
                    <div class="text-xs text-muted-foreground/60">
                        No cloud required
                    </div>
                </div>
            </div>

            <!-- Product demo -->
            <div
                class="w-full max-w-6xl pt-12 flex flex-col items-center"
                in:fly={{ y: 40, delay: 800, duration: 800 }}
            >
                <!-- Interactive demo label -->
                <div class="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground border border-accent/20 mb-4">
                    <MousePointerClickIcon class="size-4" />
                    <span>Interactive Demo</span>
                </div>
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
                                        Live app — click to explore
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
            </div>
        </div>
    </div>
</section>

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
