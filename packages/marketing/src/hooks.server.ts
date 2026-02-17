import { sequence } from "@sveltejs/kit/hooks";
import { api as handleRemult } from "$lib/server/remult/api";
import { handleAuth } from "$lib/server/remult/handle-auth";

export const handle = sequence(handleRemult, handleAuth);
