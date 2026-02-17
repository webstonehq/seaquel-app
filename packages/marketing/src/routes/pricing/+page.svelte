<script lang="ts">
    import NavHeader from "$lib/components/nav-header.svelte";
    import CtaSection from "$lib/components/cta-section.svelte";
    import FooterSection from "$lib/components/footer-section.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Card } from "$lib/components/ui/card";
    import { fly } from "svelte/transition";
    import { CheckIcon, XIcon, UserIcon, BuildingIcon } from "lucide-svelte";

    let { data } = $props();

    const tierConfig: Record<
        string,
        {
            name: string;
            period: string;
            description: string;
            icon: typeof UserIcon;
            features: { text: string; included: boolean }[];
            highlight: boolean;
            originalPrice: string;
        }
    > = {
        individual: {
            name: "Individual",
            period: "/ year",
            description:
                "For individual developers using Seaquel commercially or as freelancers.",
            originalPrice: "$80",
            icon: UserIcon,
            features: [
                { text: "Commercial use", included: true },
                { text: "All features included", included: true },
                { text: "1 year of updates", included: true },
                { text: "1 device activation", included: true },
                { text: "Community support", included: true },
                { text: "Transferable license", included: false },
            ],
            highlight: false,
        },
        business: {
            name: "Business",
            period: "/ year / seat",
            description:
                "For teams and organizations. Reassign seats as your team changes.",
            originalPrice: "$130",
            icon: BuildingIcon,
            features: [
                { text: "Commercial use", included: true },
                { text: "All features included", included: true },
                { text: "1 year of updates", included: true },
                { text: "1 device activation per seat", included: true },
                { text: "Priority support", included: true },
                { text: "Transferable seats", included: true },
            ],
            highlight: true,
        },
    };

    const plans = $derived(
        data.plans
            ?.map((p) => ({
                ...tierConfig[p.tier],
                productId: p.productId,
                formattedPrice: p.formattedPrice,
            }))
            .filter((p) => p.name) ?? [],
    );
</script>

<svelte:head>
    <title>Pricing - Seaquel</title>
    <meta
        name="description"
        content="Simple, transparent pricing for Seaquel commercial licenses. Individual and Business plans available."
    />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
    <NavHeader />

    <div class="pt-16">
        <!-- Hero -->
        <section
            class="py-20 md:py-28 bg-linear-to-b from-background to-muted/20"
        >
            <div class="container mx-auto px-4 md:px-6 text-center">
                <div in:fly={{ y: 30, duration: 600 }}>
                    <h1
                        class="text-4xl md:text-6xl font-bold tracking-tight mb-4"
                    >
                        Simple, Transparent Pricing
                    </h1>
                    <p
                        class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Seaquel is free and open source for personal use.
                        Commercial licenses are available for professional and
                        business use.
                    </p>
                </div>
            </div>
        </section>

        <!-- Pricing Cards -->
        <section class="py-16 md:py-20">
            <div class="container mx-auto px-4 md:px-6">
                {#if data.error}
                <div class="max-w-md mx-auto text-center">
                    <p class="text-muted-foreground">{data.error}</p>
                </div>
                {:else}
                <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {#each plans as plan, index (plan.name)}
                        <div
                            in:fly={{
                                y: 30,
                                delay: 100 + index * 150,
                                duration: 600,
                            }}
                        >
                            <Card
                                class="relative h-full flex flex-col border-2 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl {plan.highlight
                                    ? 'border-primary/50 bg-linear-to-br from-primary/5 to-primary/10 hover:shadow-primary/10'
                                    : 'border-border hover:border-primary/30 hover:shadow-primary/5'}"
                            >
                                {#if plan.highlight}
                                    <span
                                        class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold"
                                    >
                                        Recommended for teams
                                    </span>
                                {/if}

                                <!-- Header -->
                                <div class="mb-6">
                                    <div
                                        class="size-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 {plan.highlight
                                            ? 'ring-2 ring-primary/20'
                                            : ''}"
                                    >
                                        <plan.icon
                                            class="size-6 text-primary"
                                        />
                                    </div>
                                    <h2 class="text-2xl font-bold mb-1">
                                        {plan.name}
                                    </h2>
                                    <p class="text-sm text-muted-foreground">
                                        {plan.description}
                                    </p>
                                </div>

                                <!-- Price -->
                                <div class="mb-8">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span
                                            class="text-lg text-muted-foreground line-through"
                                            >{plan.originalPrice}</span
                                        >
                                        <span
                                            class="px-2 py-0.5 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-semibold"
                                            >Launch discount</span
                                        >
                                    </div>
                                    <span
                                        class="text-4xl md:text-5xl font-bold tracking-tight"
                                        >{plan.formattedPrice}</span
                                    >
                                    <span class="text-muted-foreground ml-1"
                                        >{plan.period}</span
                                    >
                                </div>

                                <!-- Features -->
                                <ul class="flex flex-col gap-3 mb-8 flex-1">
                                    {#each plan.features as feature}
                                        <li class="flex items-start gap-3">
                                            {#if feature.included}
                                                <CheckIcon
                                                    class="size-5 text-green-500 mt-0.5 shrink-0"
                                                />
                                                <span class="text-sm"
                                                    >{feature.text}</span
                                                >
                                            {:else}
                                                <XIcon
                                                    class="size-5 text-muted-foreground/40 mt-0.5 shrink-0"
                                                />
                                                <span
                                                    class="text-sm text-muted-foreground"
                                                    >{feature.text}</span
                                                >
                                            {/if}
                                        </li>
                                    {/each}
                                </ul>

                                <!-- CTA -->
                                <Button
                                    href="/buy/{plan.productId}"
                                    size="lg"
                                    class="w-full {plan.highlight
                                        ? 'shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
                                        : ''}"
                                    variant={plan.highlight
                                        ? "default"
                                        : "outline"}
                                >
                                    Buy {plan.name}
                                </Button>
                            </Card>
                        </div>
                    {/each}
                </div>
                {/if}
            </div>
        </section>

        <!-- Transferability note -->
        <section class="py-16 bg-muted/20">
            <div class="container mx-auto px-4 md:px-6 max-w-3xl">
                <div
                    class="text-center mb-10"
                    in:fly={{ y: 20, duration: 600 }}
                >
                    <h2
                        class="text-2xl md:text-3xl font-bold tracking-tight mb-4"
                    >
                        How Seat Transfers Work
                    </h2>
                    <p class="text-muted-foreground">
                        Business licenses include transferable seats, so your
                        team stays flexible.
                    </p>
                </div>

                <Card class="border-2 border-primary/10 p-6 md:p-8">
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col md:flex-row gap-6">
                            <div class="flex-1 flex flex-col gap-2">
                                <div class="flex items-center gap-2 mb-1">
                                    <UserIcon
                                        class="size-5 text-muted-foreground"
                                    />
                                    <h3 class="font-semibold">
                                        Individual License
                                    </h3>
                                </div>
                                <p class="text-sm text-muted-foreground">
                                    Tied to a single person. If you need to
                                    reassign a license to a different user, a
                                    Business license is the way to go.
                                </p>
                            </div>
                            <div class="flex-1 flex flex-col gap-2">
                                <div class="flex items-center gap-2 mb-1">
                                    <BuildingIcon class="size-5 text-primary" />
                                    <h3 class="font-semibold">
                                        Business License
                                    </h3>
                                </div>
                                <p class="text-sm text-muted-foreground">
                                    When a team member leaves, you can
                                    deactivate their seat and reassign it to
                                    someone new. No additional cost, no waiting
                                    — just reassign and go.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>

        <!-- FAQ -->
        <section class="py-16 md:py-20">
            <div class="container mx-auto px-4 md:px-6 max-w-3xl">
                <h2
                    class="text-2xl md:text-3xl font-bold tracking-tight text-center mb-10"
                >
                    Frequently Asked Questions
                </h2>

                <div class="flex flex-col gap-6">
                    {#each [{ q: "Is Seaquel free?", a: "Yes — Seaquel is free and open source for personal, non-commercial use. A commercial license is only required if you use Seaquel for work." }, { q: "What counts as commercial use?", a: "If you're using Seaquel as part of your work at a company, freelancing, or any revenue-generating activity, that's commercial use." }, { q: "Can I try Seaquel before buying?", a: "Absolutely. Seaquel is fully functional without a license. Try it as long as you like, and purchase a license when you're ready to use it commercially." }, { q: "What happens when my license expires?", a: "You keep access to the version you had at expiration. Renew to get another year of updates and support." }, { q: "Can I transfer my Individual license to someone else?", a: "No. Individual licenses are tied to one person. If you need transferable seats, choose the Business plan." }, { q: "How do Business seat transfers work?", a: "Deactivate the departing member's seat and activate it for someone new — no extra charge. For example, if you buy 5 seats and someone leaves, you reassign that seat to the new hire." }] as faq}
                        <div class="border-b pb-6 last:border-b-0">
                            <h3 class="font-semibold mb-2">{faq.q}</h3>
                            <p
                                class="text-sm text-muted-foreground leading-relaxed"
                            >
                                {faq.a}
                            </p>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <CtaSection />
        <FooterSection />
    </div>
</div>
