<script lang="ts">
    import { GithubIcon, DownloadIcon } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import Logo from "./logo.svelte";
    import LogoDiscord from "./logo-discord.svelte";
</script>

<footer class="border-t bg-muted/30">
    <div class="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <!-- Brand Column -->
            <div class="md:col-span-2 flex flex-col gap-4">
                <div class="flex items-center gap-2">
                    <Logo class="size-8 text-primary" />
                    <span class="text-xl font-bold">Seaquel</span>
                </div>
                <p class="text-sm text-muted-foreground max-w-sm">
                    The modern database client built for speed, efficiency, and
                    intelligence. Free and open source.
                </p>
                <div class="flex gap-2">
                    <Button
                        href="https://github.com/webstonehq/seaquel"
                        target="_blank"
                        size="icon"
                        variant="ghost"
                        class="size-9"
                    >
                        <GithubIcon class="size-4" />
                    </Button>
                    <Button
                        href="https://discord.gg/QuzUESE8x4"
                        target="_blank"
                        size="icon"
                        variant="ghost"
                        class="size-9"
                    >
                        <LogoDiscord class="size-4 fill-current" />
                    </Button>
                </div>
            </div>

            <!-- Product Links -->
            <div class="flex flex-col gap-4">
                <h3 class="font-semibold">Product</h3>
                <ul class="flex flex-col gap-2 text-sm text-muted-foreground">
                    <li>
                        <a
                            href="/#features"
                            class="hover:text-foreground transition-colors"
                            >Features</a
                        >
                    </li>
                    <li>
                        <a
                            href="/features"
                            class="hover:text-foreground transition-colors"
                            >All Features</a
                        >
                    </li>
                    <li>
                        <a
                            href="/pricing"
                            class="hover:text-foreground transition-colors"
                            >Pricing</a
                        >
                    </li>
                    <li>
                        <a
                            href="/download"
                            class="hover:text-foreground transition-colors"
                            >Download</a
                        >
                    </li>
                    <li>
                        <a
                            href="/changelog"
                            class="hover:text-foreground transition-colors"
                            >Changelog</a
                        >
                    </li>
                </ul>
            </div>

            <!-- Resources Links -->
            <div class="flex flex-col gap-4">
                <h3 class="font-semibold">Resources</h3>
                <ul class="flex flex-col gap-2 text-sm text-muted-foreground">
                    <li>
                        <a
                            href="https://github.com/webstonehq/seaquel"
                            target="_blank"
                            class="hover:text-foreground transition-colors"
                            >GitHub</a
                        >
                    </li>
                    <li>
                        <a
                            href="https://discord.gg/QuzUESE8x4"
                            target="_blank"
                            class="hover:text-foreground transition-colors"
                            >Discord Community</a
                        >
                    </li>
                    <li>
                        <a
                            href="https://github.com/webstonehq/seaquel/issues"
                            target="_blank"
                            class="hover:text-foreground transition-colors"
                            >Report Issue</a
                        >
                    </li>
                </ul>
            </div>
        </div>

        <!-- Bottom bar -->
        <div
            class="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
        >
            <div class="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <p class="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Seaquel. MIT Licensed.
                </p>
                <div class="flex items-center gap-4 text-sm text-muted-foreground">
                    <a href="/terms" class="hover:text-foreground transition-colors">Terms</a>
                    <a href="/privacy" class="hover:text-foreground transition-colors">Privacy</a>
                </div>
            </div>
            <Button
                href="/download"
                variant="outline"
                size="sm"
                class="gap-2"
            >
                <DownloadIcon class="size-4" />
                Download Seaquel
            </Button>
        </div>
    </div>
</footer>
