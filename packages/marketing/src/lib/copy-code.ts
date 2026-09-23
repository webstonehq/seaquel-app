const resetTimers = new WeakMap<HTMLButtonElement, ReturnType<typeof setTimeout>>();

/**
 * Delegated click handler for the copy buttons that svelte.config.js injects
 * into every markdown code fence.
 */
export async function handleCodeCopy(event: MouseEvent) {
	const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-code-copy]");
	const code = button?.parentElement?.querySelector("pre");
	if (!button || !code) return;

	try {
		await navigator.clipboard.writeText(code.textContent ?? "");
	} catch {
		return; // clipboard API can throw in insecure contexts
	}

	button.dataset.copied = "";
	button.setAttribute("aria-label", "Copied");
	clearTimeout(resetTimers.get(button));
	resetTimers.set(
		button,
		setTimeout(() => {
			delete button.dataset.copied;
			button.setAttribute("aria-label", "Copy code");
		}, 2000)
	);
}
