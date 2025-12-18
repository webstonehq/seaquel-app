<script lang="ts">
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { Button } from "$lib/components/ui/button";
    import { Card } from "$lib/components/ui/card";
    import { DownloadIcon, ArrowRightIcon } from "lucide-svelte";

    let open = $state(false);
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
                    Ready to Transform Your Database Workflow?
                </h2>
                <p class="text-lg text-muted-foreground max-w-2xl">
                    Join thousands of developers who've already made the switch
                    to faster, smarter database management.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <AlertDialog.Root bind:open>
                        <AlertDialog.Trigger
                            class={buttonVariants({
                                size: "lg",
                                class: "text-base px-8 shadow-lg-lg-lg-lg shadow-lg-lg-lg-primary/25",
                            })}
                        >
                            Download soon
                        </AlertDialog.Trigger>
                        <AlertDialog.Content>
                            <AlertDialog.Header>
                                <AlertDialog.Title
                                    >Waiting for Apple 😊</AlertDialog.Title
                                >
                                <AlertDialog.Description>
                                    Thank you so much for your interest, this
                                    means a lot!<br /><br />
                                    The Mac app is ready to go, but I am waiting for
                                    the business Apple account to be ready.
                                </AlertDialog.Description>
                            </AlertDialog.Header>
                            <AlertDialog.Footer>
                                <AlertDialog.Action
                                    onclick={() => (open = false)}
                                    >Got it</AlertDialog.Action
                                >
                            </AlertDialog.Footer>
                        </AlertDialog.Content>
                    </AlertDialog.Root>
                    <!-- <Button size="lg" class="text-base px-8 shadow-lg-lg-lg-lg shadow-lg-lg-lg-primary/25">
						<DownloadIcon class="mr-2" />
						Download Now
					</Button> -->
                    <!-- <Button size="lg" variant="outline" class="text-base px-8">
						View Documentation
						<ArrowRightIcon class="ml-2" />
					</Button> -->
                </div>
                <p class="text-sm text-muted-foreground pt-4">
                    Free forever • No credit card required • Available for
                    macOS, Windows & Linux
                </p>
            </div>
        </Card>
    </div>
</section>
