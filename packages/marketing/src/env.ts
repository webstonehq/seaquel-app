import { defineEnvVars } from '@sveltejs/kit/env';

// All optional. Unset values used to come through `$env/dynamic/*` as
// `undefined`; the Dodo trio falls back to '' because every caller already
// treats empty as unset (`DODO_MODE || 'test'`).
const optional = (input: string | undefined) => input;

export const variables = defineEnvVars({
	DODO_API_KEY: { schema: (input) => input ?? '' },
	DODO_MODE: { schema: (input) => input ?? '' },
	PUBLIC_DODO_PRODUCT_MAP: { public: true, schema: (input) => input ?? '' },

	// Control plane, read through `readEnv` in #lib/server/control/env.ts.
	DODO_WEBHOOK_SECRET: { schema: optional },
	SEAQUEL_CONTROL_URL: { schema: optional },
	FLY_API_TOKEN: { schema: optional },
	FLY_ORG: { schema: optional },
	FLY_IMAGE: { schema: optional },
	CF_API_TOKEN: { schema: optional },
	CF_ACCOUNT_ID: { schema: optional },
	CF_CONTAINER_IMAGE: { schema: optional },
	CF_ZONE_ID: { schema: optional },
	CF_ROOT_DOMAIN: { schema: optional },
	SEAQUEL_BUNDLE_SIGNING_PRIVATE_KEY: { schema: optional },
	SEAQUEL_AIRGAP_GRACE_SECONDS: { schema: optional }
});
