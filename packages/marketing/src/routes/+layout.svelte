<script lang="ts">
    import "./layout.css";
    import favicon from "$lib/assets/favicon.svg";
    import { ModeWatcher } from "mode-watcher";
    import { remult, Remult } from "remult";
    import { createSubscriber } from "svelte/reactivity";
    import { untrack } from "svelte";

    let { children, data } = $props();

    $effect(() => {
        // Trigger the effect only on data.user update
        data.user;
        untrack(() => {
            remult.user = data.user;
        });
    });

    function initRemultSvelteReactivity() {
        // Auth reactivity (remult.user, remult.authenticated(), ...)
        {
            let update = () => {};
            let s = createSubscriber((u) => {
                update = u;
            });
            remult.subscribeAuth({
                reportObserved: () => s(),
                reportChanged: () => update(),
            });
        }
        // Entities reactivity
        {
            Remult.entityRefInit = (x) => {
                let update = () => {};
                let s = createSubscriber((u) => {
                    update = u;
                });
                x.subscribe({
                    reportObserved: () => s(),
                    reportChanged: () => update(),
                });
            };
        }
    }
    initRemultSvelteReactivity();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
{@render children()}
