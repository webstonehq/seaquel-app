import type { D1Database, Fetcher, KVNamespace } from "@cloudflare/workers-types";

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        SEAQUEL_DB: D1Database;
        // Static-asset binding from wrangler.jsonc. Used to read files we ship
        // (fonts, resvg.wasm) without a same-origin subrequest.
        ASSETS: Fetcher;
        GITHUB_API_CACHE: KVNamespace;
        GITHUB_TOKEN: string;
        GITHUB_TOKEN_FETCH_RELEASES_URL: string;
        // Dodo Payments — already declared in wrangler.jsonc.
        DODO_MODE: "test" | "live";
        PUBLIC_DODO_PRODUCT_MAP: string;
        DODO_API_KEY?: string; // wrangler secret
        DODO_WEBHOOK_SECRET?: string; // wrangler secret
        // Control-plane platform credentials — wrangler secrets.
        // Missing values trigger the in-memory mock platform adapter.
        FLY_API_TOKEN?: string;
        FLY_ORG?: string;
        FLY_IMAGE?: string;
        CF_API_TOKEN?: string;
        CF_ACCOUNT_ID?: string;
        CF_CONTAINER_IMAGE?: string;
        CF_ZONE_ID?: string;
        CF_ROOT_DOMAIN?: string;
      };
      context: {
        waitUntil(promise: Promise<unknown>): void;
      };
    }
  }
}

export {};
