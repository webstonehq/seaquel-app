import type { Handle } from "@sveltejs/kit";
import { auth } from "./better-auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";

export const handleAuth: Handle = async ({ event, resolve }) => {
  return svelteKitHandler({ event, resolve, auth, building });
};
