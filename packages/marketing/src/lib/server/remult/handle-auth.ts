import type { Handle } from "@sveltejs/kit/hooks";
import { auth } from "./better-auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/env";

export const handleAuth: Handle = async ({ event, resolve }) => {
  return svelteKitHandler({ event, resolve, auth, building });
};
