// The parts of "cloudflare:workers" the app uses. @cloudflare/workers-types
// only declares this module in its ambient build, which would also put the
// Workers globals (Request, Response, ...) over the DOM lib everywhere.
// `Cloudflare.Env` is declared in app.d.ts.
declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
  export function waitUntil(promise: Promise<unknown>): void;
}
