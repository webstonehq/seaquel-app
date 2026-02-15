import { env } from "$env/dynamic/public";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = () => {
	return {
		productMap: JSON.parse(env.PUBLIC_DODO_PRODUCT_MAP || '{}'),
	};
};
