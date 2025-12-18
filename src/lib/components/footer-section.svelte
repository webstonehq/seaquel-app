<script lang="ts">
    // import { GithubIcon, TwitterIcon, DiscIcon } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import Logo from "./logo.svelte";

    const footerLinks = {
        product: [
            { label: "Features", href: "#features" },
            { label: "Download", href: "#download" },
            { label: "Pricing", href: "#pricing" },
            { label: "Changelog", href: "#changelog" },
        ],
        resources: [
            { label: "Documentation", href: "#docs" },
            { label: "API Reference", href: "#api" },
            { label: "Tutorials", href: "#tutorials" },
            { label: "Community", href: "#community" },
        ],
        company: [
            { label: "About", href: "#about" },
            { label: "Blog", href: "#blog" },
            { label: "Careers", href: "#careers" },
            { label: "Contact", href: "#contact" },
        ],
    };
</script>

<footer class="border-t bg-muted/30">
    <div class="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <!-- Brand -->
            <div class="col-span-2 md:col-span-1 flex flex-col gap-4">
                <div class="flex items-center gap-2">
                    <Logo class="size-8 text-primary" />
                    <span class="text-xl font-bold">Seaquel</span>
                </div>
                <p class="text-sm text-muted-foreground">
                    The modern database client built for speed, efficiency, and
                    intelligence.
                </p>
                <!-- <div class="flex gap-2">
					<Button size="icon" variant="ghost" class="size-9">
						<GithubIcon class="size-4" />
					</Button>
					<Button size="icon" variant="ghost" class="size-9">
						<TwitterIcon class="size-4" />
					</Button>
					<Button size="icon" variant="ghost" class="size-9">
						<DiscIcon class="size-4" />
					</Button>
				</div> -->
            </div>

            <!-- Links -->
            <!-- <div class="flex flex-col gap-4">
				<h3 class="font-semibold">Product</h3>
				<ul class="flex flex-col gap-2">
					{#each footerLinks.product as link}
						<li>
							<a href={link.href} class="text-sm text-muted-foreground hover:text-foreground transition-colors">
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div class="flex flex-col gap-4">
				<h3 class="font-semibold">Resources</h3>
				<ul class="flex flex-col gap-2">
					{#each footerLinks.resources as link}
						<li>
							<a href={link.href} class="text-sm text-muted-foreground hover:text-foreground transition-colors">
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div class="flex flex-col gap-4">
				<h3 class="font-semibold">Company</h3>
				<ul class="flex flex-col gap-2">
					{#each footerLinks.company as link}
						<li>
							<a href={link.href} class="text-sm text-muted-foreground hover:text-foreground transition-colors">
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div> -->
        </div>

        <!-- Bottom bar -->
        <div
            class="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
        >
            <p class="text-sm text-muted-foreground">
                © 2025 Seaquel. All rights reserved.
            </p>
            <div class="flex gap-6 text-sm text-muted-foreground">
                <!-- <a href="#privacy" class="hover:text-foreground transition-colors">Privacy Policy</a> -->
                <!-- <a href="#terms" class="hover:text-foreground transition-colors">Terms of Service</a> -->
                <!-- <a href="#license" class="hover:text-foreground transition-colors">License</a> -->
            </div>
        </div>
    </div>
</footer>
