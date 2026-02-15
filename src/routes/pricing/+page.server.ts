import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { fetchProductPrice, formatPrice } from '$lib/server/dodo';
import type { PageServerLoad } from './$types';

export interface PricingPlan {
	productId: string;
	tier: string;
	price: number;
	currency: string;
	formattedPrice: string;
}

export const load: PageServerLoad = async () => {
	const productMap = JSON.parse(publicEnv.PUBLIC_DODO_PRODUCT_MAP || '{}') as Record<
		string,
		string
	>;
	const apiKey = env.DODO_API_KEY;
	const dodoMode = env.DODO_MODE || 'test';

	if (!apiKey) {
		return { plans: null, error: 'Payment service not configured' };
	}

	const entries = Object.entries(productMap);
	if (entries.length === 0) {
		return { plans: null, error: 'No products configured' };
	}

	try {
		const plans: PricingPlan[] = await Promise.all(
			entries.map(async ([productId, tier]) => {
				const { price, currency } = await fetchProductPrice(productId, dodoMode as 'test' | 'live', apiKey);
				return {
					productId,
					tier,
					price,
					currency,
					formattedPrice: formatPrice(price, currency),
				};
			}),
		);

		return { plans, error: null };
	} catch (e) {
		console.error('[pricing] Failed to fetch product prices:', e);
		return { plans: null, error: 'Unable to load pricing. Please try again later.' };
	}
};
