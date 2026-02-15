import { sequence } from "@sveltejs/kit/hooks";
import type { Handle } from "@sveltejs/kit";
import { api as handleRemult, setD1 } from "$lib/server/remult/api";
import { handleAuth } from "$lib/server/remult/handle-auth";

const initPlatform: Handle = async ({ event, resolve }) => {
  try {
    const db = event.platform?.env?.SEAQUEL_DB;
    if (db) setD1(db);
  } catch {
    // platform.env throws during prerendering — safe to ignore
  }
  return resolve(event);
};

export const handle = sequence(initPlatform, handleRemult, handleAuth);
