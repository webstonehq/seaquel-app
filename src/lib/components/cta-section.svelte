<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Card } from "$lib/components/ui/card";
    import { DownloadIcon, CheckIcon, ShieldIcon, HeartIcon } from "lucide-svelte";
    import { onMount } from "svelte";
    import { detectPlatform, detectArchitecture, getDownloadUrl, type Platform, type Architecture } from "$lib/utils";

    let platform: Platform = $state("unknown");
    let arch: Architecture = $state("unknown");
    let downloadUrl = $derived(getDownloadUrl(platform, arch));

    onMount(() => {
        platform = detectPlatform();
        arch = detectArchitecture();
    });
</script>

<section class="py-20 md:py-32">
    <div class="container mx-auto px-4 md:px-6">
        <Card
            class="relative overflow-hidden border-2 border-primary/20 bg-linear-to-br from-primary/5 via-accent/5 to-background p-8 md:p-16"
        >
            <!-- Decorative elements -->
            <div
                class="absolute top-0 right-0 size-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
            ></div>
            <div
                class="absolute bottom-0 left-0 size-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"
            ></div>

            <div
                class="relative flex flex-col items-center text-center space-y-6"
            >
                <h2
                    class="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl"
                >
                    Stop Fighting Your Database Client
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl">
                    Experience what a database client should feel like. Fast, lightweight, and built with the features you actually need.
                </p>

                <!-- Trust Signals -->
                <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-4 text-sm text-muted-foreground">
                    <div class="flex items-center gap-2">
                        <CheckIcon class="size-4 text-green-500" />
                        <span>Free forever</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <CheckIcon class="size-4 text-green-500" />
                        <span>No account required</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <ShieldIcon class="size-4 text-green-500" />
                        <span>100% local - no telemetry</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <HeartIcon class="size-4 text-green-500" />
                        <span>Open source</span>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button href={downloadUrl} size="lg" class="text-base px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                        <DownloadIcon class="mr-2" />
                        Download Now
                    </Button>
                </div>

                <p class="text-sm text-muted-foreground pt-2">
                    Available for macOS & Linux today. Windows coming Q1 2026.
                </p>
            </div>
        </Card>
    </div>
</section>
