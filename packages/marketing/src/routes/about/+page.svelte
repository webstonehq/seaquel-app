<script lang="ts">
    import NavHeader from "$lib/components/nav-header.svelte";
    import CtaSection from "$lib/components/cta-section.svelte";
    import FooterSection from "$lib/components/footer-section.svelte";
    import Seo from "$lib/components/seo.svelte";
    import { Button } from "$lib/components/ui/button";
    import LogoDiscord from "$lib/components/logo-discord.svelte";
    import { LinkedinIcon, GithubIcon } from "lucide-svelte";
    import { FOUNDER } from "$lib/founder";
    import founderPhoto from "$lib/assets/mike_headshot.webp";
</script>

<Seo
    title="About Seaquel — Built by {FOUNDER.name}"
    description="Seaquel is an open source database client built by {FOUNDER.name}. Why it exists and who's behind it."
/>

<div class="min-h-screen bg-background text-foreground">
    <NavHeader />

    <div class="pt-16">
        <section class="py-16 md:py-24">
            <div class="container mx-auto px-4 md:px-6 max-w-3xl">
                <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-12">
                    About Seaquel
                </h1>

                <div class="flex flex-col sm:flex-row gap-8 sm:gap-10">
                    <div class="flex flex-col items-center sm:items-start gap-3 shrink-0">
                        <img
                            src={founderPhoto}
                            alt={FOUNDER.name}
                            width="120"
                            height="150"
                            class="rounded-xl object-cover border"
                        />
                        <div class="text-center sm:text-left leading-tight">
                            <p class="font-semibold">{FOUNDER.name}</p>
                            <p class="text-sm text-muted-foreground">
                                {FOUNDER.role}
                            </p>
                        </div>
                        <div class="flex gap-1">
                            <Button
                                href={FOUNDER.linkedin}
                                target="_blank"
                                rel="noopener"
                                size="icon"
                                variant="ghost"
                                class="size-9"
                                aria-label="{FOUNDER.name} on LinkedIn"
                            >
                                <LinkedinIcon class="size-4" />
                            </Button>
                            <Button
                                href="https://github.com/webstonehq/seaquel"
                                target="_blank"
                                size="icon"
                                variant="ghost"
                                class="size-9"
                                aria-label="Seaquel on GitHub"
                            >
                                <GithubIcon class="size-4" />
                            </Button>
                            <Button
                                href="/discord"
                                target="_blank"
                                size="icon"
                                variant="ghost"
                                class="size-9"
                                aria-label="Seaquel Discord"
                            >
                                <LogoDiscord class="size-4 fill-current" />
                            </Button>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4 text-muted-foreground leading-relaxed">
                        <h2 class="text-xl font-semibold text-foreground">
                            Why I built this
                        </h2>
                        <p>
                            I've spent most of my career writing SQL, and the
                            database clients I used were either slow, cluttered,
                            or wanted an account before I could run a single
                            query. I wanted something that opens fast, stays out
                            of the way, and makes it easy to understand what a
                            query is actually doing. Seaquel is that tool. It's
                            MIT-licensed open source, the official builds are
                            free for personal use, and it's built by one
                            person who reads every GitHub issue and Discord
                            message. If something's broken or missing, tell me
                            and I'll fix it.
                        </p>
                        <p>
                            <a
                                href={FOUNDER.linkedin}
                                target="_blank"
                                rel="noopener"
                                class="text-foreground underline underline-offset-4 hover:text-primary"
                                >Connect with me on LinkedIn</a
                            >
                            or read along on the
                            <a
                                href="/blog"
                                class="text-foreground underline underline-offset-4 hover:text-primary"
                                >blog</a
                            >.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <CtaSection />
    </div>

    <FooterSection />
</div>
