import { remult } from "remult";
import type { LayoutLoad } from "./$types";

export const load = (async ({ data, fetch }) => {
  // Instruct remult to use the special svelte fetch
  // Like this univeral load will work in SSR & CSR
  remult.useFetch(fetch);
  return data;
}) satisfies LayoutLoad;
