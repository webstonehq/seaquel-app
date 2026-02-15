<script lang="ts">
    import { tick, onDestroy } from "svelte";
    import NavHeader from "$lib/components/nav-header.svelte";
    import FooterSection from "$lib/components/footer-section.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Card } from "$lib/components/ui/card";
    import { fly } from "svelte/transition";
    import {
        CheckIcon,
        MinusIcon,
        PlusIcon,
        ShieldCheckIcon,
        ArrowLeftIcon,
        LoaderCircleIcon,
    } from "lucide-svelte";
    import type { ThemeConfig, ThemeModeConfig } from "dodopayments-checkout";

    let { data } = $props();

    let units = $state(1);
    let loading = $state(false);
    let errorMessage = $state("");
    let step = $state<"configure" | "checkout">("configure");
    let sessionId = $state("");

    let total = $derived(data.plan.price * units);

    // Hold a reference to the DodoPayments module once loaded
    let DodoPaymentsRef: any = null;

    const themeConfig: ThemeConfig = {
        light: {
            bgPrimary: "#000",
            bgSecondary: "#F4F4F5",
            borderPrimary: "#E4E4E7",
            borderSecondary: "#E4E4E7",
            inputFocusBorder: "#CBA700",
            textPrimary: "#09090B",
            textSecondary: "#71717A",
            textPlaceholder: "#A1A1AA",
            textError: "#DC2626",
            textSuccess: "#16A34A",
            buttonPrimary: "#CBA700",
            buttonPrimaryHover: "#B89600",
            buttonTextPrimary: "#422006",
            buttonSecondary: "#F4F4F5",
            buttonSecondaryHover: "#E4E4E7",
            buttonTextSecondary: "#09090B",
        },
        dark: {
            bgPrimary: "#09090B",
            bgSecondary: "#18181B",
            borderPrimary: "#27272A",
            borderSecondary: "#27272A",
            inputFocusBorder: "#CBA700",
            textPrimary: "#FAFAFA",
            textSecondary: "#A1A1AA",
            textPlaceholder: "#71717A",
            textError: "#EF4444",
            textSuccess: "#34D399",
            buttonPrimary: "#CBA700",
            buttonPrimaryHover: "#B89600",
            buttonTextPrimary: "#422006",
            buttonSecondary: "#27272A",
            buttonSecondaryHover: "#3F3F46",
            buttonTextSecondary: "#FAFAFA",
        },
    };

    function decrementUnits() {
        if (units > 1) units--;
    }

    function incrementUnits() {
        if (units < 100) units++;
    }

    async function handleCheckout() {
        loading = true;
        errorMessage = "";

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: data.productId,
                    quantity: data.plan.allowMultipleUnits ? units : 1,
                    returnUrl: `${window.location.origin}/buy/success`,
                }),
            });

            const result = await res.json();

            if (!res.ok || !result.checkoutUrl) {
                errorMessage =
                    result.message ||
                    "Failed to create checkout session. Please try again.";
                return;
            }

            sessionId = result.sessionId;

            const { DodoPayments } = await import("dodopayments-checkout");
            DodoPaymentsRef = DodoPayments;

            DodoPayments.Initialize({
                mode: data.dodoMode,
                displayType: "inline",
                onEvent: (event: any) => {
                    switch (event.event_type) {
                        case "checkout.status": {
                            const status = event.data?.message?.status;
                            if (status === "succeeded") {
                                window.location.href = `/buy/success?session_id=${sessionId}`;
                            } else if (status === "failed") {
                                errorMessage =
                                    "Payment failed. Please try again.";
                            }
                            break;
                        }
                        case "checkout.redirect_requested": {
                            window.location.href =
                                event.data?.message?.redirect_to;
                            break;
                        }
                        case "checkout.error": {
                            errorMessage =
                                "An error occurred during checkout. Please try again.";
                            break;
                        }
                        case "checkout.link_expired": {
                            errorMessage =
                                "Checkout session expired. Please try again.";
                            step = "configure";
                            break;
                        }
                    }
                },
            });

            step = "checkout";
            await tick();

            DodoPayments.Checkout.open({
                checkoutUrl: result.checkoutUrl,
                elementId: "dodo-checkout",
                options: {
                    manualRedirect: true,
                    themeConfig,
                },
            });
        } catch {
            errorMessage = "Something went wrong. Please try again.";
        } finally {
            loading = false;
        }
    }

    function backToConfigure() {
        DodoPaymentsRef?.Checkout?.close();
        step = "configure";
        errorMessage = "";
    }

    onDestroy(() => {
        DodoPaymentsRef?.Checkout?.close();
    });
</script>

<svelte:head>
    <title>Buy {data.plan.name} - Seaquel</title>
    <meta
        name="description"
        content="Purchase a {data.plan.name} license for Seaquel."
    />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
    <NavHeader />

    <div class="pt-16">
        <section class="py-16 md:py-24">
            <div class="container mx-auto px-4 md:px-6 max-w-2xl">
                <div in:fly={{ y: 20, duration: 500 }}>
                    {#if step === "checkout"}
                        <button
                            onclick={backToConfigure}
                            class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                        >
                            <ArrowLeftIcon class="size-4" />
                            Back to options
                        </button>
                    {:else}
                        <a
                            href="/pricing"
                            class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
                        >
                            <ArrowLeftIcon class="size-4" />
                            Back to pricing
                        </a>
                    {/if}

                    <h1
                        class="text-3xl md:text-4xl font-bold tracking-tight mb-2"
                    >
                        {#if step === "checkout"}
                            Complete your purchase
                        {:else}
                            {data.plan.name} License
                        {/if}
                    </h1>
                    <p class="text-muted-foreground mb-8">
                        {#if step === "checkout"}
                            {data.plan.name} &mdash;
                            {#if data.plan.allowMultipleUnits && units > 1}
                                {units} seats &times; ${data.plan.price} =
                            {/if}
                            ${total} / year
                        {:else}
                            {data.plan.description}
                        {/if}
                    </p>
                </div>

                {#if step === "configure"}
                    <div
                        class="flex flex-col gap-6"
                        in:fly={{ y: 20, delay: 100, duration: 500 }}
                    >
                        <!-- Plan details -->
                        <Card class="border-2 p-6">
                            <h2 class="font-semibold mb-4">What's included</h2>
                            <ul class="flex flex-col gap-2.5">
                                {#each data.plan.features as feature}
                                    <li class="flex items-center gap-2.5">
                                        <CheckIcon
                                            class="size-4 text-green-500 shrink-0"
                                        />
                                        <span class="text-sm">{feature}</span>
                                    </li>
                                {/each}
                            </ul>
                        </Card>

                        <!-- Quantity selector (business only) -->
                        {#if data.plan.allowMultipleUnits}
                            <Card class="border-2 p-6">
                                <div
                                    class="flex items-center justify-between gap-4"
                                >
                                    <div>
                                        <h2 class="font-semibold">
                                            Number of seats
                                        </h2>
                                        <p
                                            class="text-sm text-muted-foreground mt-0.5"
                                        >
                                            ${data.plan.price} per seat per year
                                        </p>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            onclick={decrementUnits}
                                            disabled={units <= 1}
                                        >
                                            <MinusIcon class="size-4" />
                                        </Button>
                                        <span
                                            class="w-12 text-center text-lg font-semibold tabular-nums"
                                            >{units}</span
                                        >
                                        <Button
                                            variant="outline"
                                            size="icon-sm"
                                            onclick={incrementUnits}
                                            disabled={units >= 100}
                                        >
                                            <PlusIcon class="size-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        {/if}

                        <!-- Order summary & checkout -->
                        <Card
                            class="border-2 border-primary/30 bg-linear-to-br from-primary/5 to-primary/10 p-6"
                        >
                            <div class="flex items-end justify-between mb-6">
                                <div>
                                    <p
                                        class="text-sm text-muted-foreground mb-0.5"
                                    >
                                        Total
                                    </p>
                                    <div class="flex items-baseline gap-1.5">
                                        <span
                                            class="text-4xl font-bold tracking-tight"
                                            >${total}</span
                                        >
                                        <span class="text-muted-foreground"
                                            >/ year</span
                                        >
                                    </div>
                                    {#if data.plan.allowMultipleUnits && units > 1}
                                        <p
                                            class="text-sm text-muted-foreground mt-1"
                                        >
                                            {units} seats &times; ${data.plan
                                                .price}
                                        </p>
                                    {/if}
                                </div>
                            </div>

                            {#if errorMessage}
                                <div
                                    class="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 mb-4"
                                >
                                    {errorMessage}
                                </div>
                            {/if}

                            <Button
                                size="lg"
                                class="w-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
                                onclick={handleCheckout}
                                disabled={loading}
                            >
                                {#if loading}
                                    <LoaderCircleIcon
                                        class="size-4 animate-spin mr-2"
                                    />
                                    Creating checkout...
                                {:else}
                                    Proceed to Payment
                                {/if}
                            </Button>

                            <div
                                class="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground"
                            >
                                <ShieldCheckIcon class="size-3.5" />
                                <span
                                    >Secure checkout powered by Dodo Payments</span
                                >
                            </div>
                        </Card>
                    </div>
                {:else}
                    <!-- Inline checkout -->
                    <div in:fly={{ y: 20, duration: 400 }}>
                        {#if errorMessage}
                            <div
                                class="rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 mb-6"
                            >
                                {errorMessage}
                            </div>
                        {/if}

                        <Card class="border-2 p-0 overflow-hidden">
                            <div
                                id="dodo-checkout"
                                class="min-h-[500px] w-full"
                            ></div>
                        </Card>

                        <div
                            class="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground"
                        >
                            <ShieldCheckIcon class="size-3.5" />
                            <span>Secure checkout powered by Dodo Payments</span
                            >
                        </div>
                    </div>
                {/if}
            </div>
        </section>

        <FooterSection />
    </div>
</div>
