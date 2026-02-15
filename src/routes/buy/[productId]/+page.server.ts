import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';
import { fetchProductPrice, formatPrice } from '$lib/server/dodo';
import type { PageServerLoad } from './$types';

const planMeta: Record<
	string,
	{
		name: string;
		period: string;
		description: string;
		features: string[];
		allowMultipleUnits: boolean;
	}
> = {
	individual: {
		name: 'Individual',
		period: '/ year',
		description: 'For individual developers using Seaquel commercially.',
		features: [
			'Commercial use',
			'All features included',
			'1 year of updates',
			'1 device activation',
			'Community support',
		],
		allowMultipleUnits: false,
	},
	business: {
		name: 'Business',
		period: '/ year / seat',
		description: 'For teams and organizations. Reassign seats as your team changes.',
		features: [
			'Commercial use',
			'All features included',
			'1 year of updates',
			'1 device activation per seat',
			'Priority support',
			'Transferable seats',
		],
		allowMultipleUnits: true,
	},
};

export const load: PageServerLoad = async ({ params }) => {
	const tierMap = JSON.parse(publicEnv.PUBLIC_DODO_PRODUCT_MAP || '{}') as Record<string, string>;
	const tier = tierMap[params.productId];

	if (!tier || !planMeta[tier]) {
		error(404, 'Product not found');
	}

	const apiKey = env.DODO_API_KEY;
	const dodoMode = (env.DODO_MODE || 'test') as 'test' | 'live';

	if (!apiKey) {
		error(503, 'Payment service not configured');
	}

	try {
		const { price, currency } = await fetchProductPrice(params.productId, dodoMode, apiKey);

		return {
			productId: params.productId,
			tier,
			plan: {
				...planMeta[tier],
				price,
				currency,
				formattedPrice: formatPrice(price, currency),
			},
			dodoMode,
		};
	} catch (e) {
		console.error('[buy] Failed to fetch product price:', e);
		error(503, 'Unable to load pricing. Please try again later.');
	}
};
