<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { DownloadIcon, GithubIcon, SparklesIcon } from "lucide-svelte";
    import { fly, fade } from "svelte/transition";
    import productUi from "$lib/assets/seaquel-product-ui.webp";
</script>

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
                    <SparklesIcon class="size-4" />
                    <span>Built with Tauri & SvelteKit</span>
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
                    Database Management,
                    <span
                        class="bg-linear-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent"
                        >Reimagined</span
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
				<Button href="https://github.com/webstonehq/seaquel/releases" size="lg" class="text-base px-8 shadow-lg-lg shadow-lg-primary/25 hover:shadow-lg-xl hover:shadow-lg-primary/30 transition-all duration-300">
					<DownloadIcon class="mr-2" />
					Download for Free
				</Button>
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
                </div>
                <div class="space-y-1">
                    <div class="text-3xl md:text-4xl font-bold text-primary">
                        50%
                    </div>
                    <div class="text-sm text-muted-foreground">Less Memory</div>
                </div>
                <div class="space-y-1">
                    <div class="text-3xl md:text-4xl font-bold text-primary">
                        100%
                    </div>
                    <div class="text-sm text-muted-foreground">
                        Offline Ready
                    </div>
                </div>
            </div>

            <!-- Product Screenshot -->
            <div
                class="w-full max-w-6xl pt-12"
                in:fly={{ y: 40, delay: 800, duration: 800 }}
            >
                <div class="relative group">
                    <!-- Glow effect -->
                    <div
                        class="absolute -inset-1 bg-linear-to-r from-primary via-accent to-primary rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                    ></div>

                    <!-- Screenshot container -->
                    <div
                        class="relative rounded-2xl overflow-hidden border-2 border-primary/20 shadow-lg-2xl bg-card"
                    >
                        <!-- Screenshot image -->
                        <enhanced:img
                            src={productUi}
                            alt="Seaquel Database Client Interface"
                            class="w-full h-auto aspect-16/10 object-cover"
                        />

                        <!-- Overlay gradient for depth -->
                        <div
                            class="absolute inset-0 bg-linear-to-t from-background/20 via-transparent to-transparent pointer-events-none"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
