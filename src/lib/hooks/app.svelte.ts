import { MediaQuery } from "svelte/reactivity";
import { setContext, getContext } from "svelte";

/** App state class-base management */
class UseApp {
	isMobile = $derived(new MediaQuery("max-width: 700px").current);
	private systemPrefersDark = $state(false);

	// Set default data
	constructor(props: { [key: string]: any }) {
		// Merge props into this instance
		Object.assign(this, props);
	}

}

/** Hook props */
export type UseAppProps = InstanceType<typeof UseApp>;

/** Set app state */
export const setApp = (props?: UseAppProps) => setContext("appState", new UseApp(props || {}));

/** Use app state */
export const useApp = () => getContext<ReturnType<typeof setApp>>("appState");