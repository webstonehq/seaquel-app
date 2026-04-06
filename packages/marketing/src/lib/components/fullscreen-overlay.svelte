<script lang="ts">
    import { XIcon } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import type { Snippet } from "svelte";

    let {
        open = $bindable(false),
        onclose,
        children,
    }: {
        open: boolean;
        onclose?: () => void;
        children: Snippet;
    } = $props();

    function close() {
        open = false;
        document.body.style.overflow = '';
        onclose?.();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape' && open) {
            close();
        }
    }

    $effect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        }
    });
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-label="Fullscreen view"
    >
        <!-- Backdrop -->
        <button
            class="absolute inset-0 bg-black/90 backdrop-blur-md cursor-default border-0"
            onclick={close}
            aria-label="Close fullscreen"
            transition:fade={{ duration: 300 }}
        ></button>

        <!-- Content container -->
        <div
            class="relative w-[95vw] h-[90vh] max-w-[1800px]"
            transition:scale={{ duration: 400, easing: cubicOut, start: 0.8 }}
        >
            <!-- Glow effect -->
            <div
                class="absolute -inset-2 bg-linear-to-r from-primary via-accent to-primary rounded-2xl blur-3xl opacity-40"
            ></div>

            <!-- Close button -->
            <button
                class="absolute -top-12 right-0 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 cursor-pointer"
                onclick={close}
            >
                <span class="text-sm">Close</span>
                <XIcon class="size-4" />
            </button>

            <!-- Click outside hint -->
            <p class="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-white/50">
                Click outside to close
            </p>

            <!-- Content frame -->
            <div class="relative w-full h-full rounded-2xl overflow-hidden border-2 border-primary/30 shadow-2xl bg-card">
                {@render children()}
            </div>
        </div>
    </div>
{/if}
