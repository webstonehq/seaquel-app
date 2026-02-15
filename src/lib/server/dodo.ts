const BASE_URLS: Record<string, string> = {
	test: 'https://test.dodopayments.com',
	live: 'https://live.dodopayments.com',
};

export interface DodoProductPrice {
	/** Price in minor units (cents) */
	price: number;
	/** ISO 4217 currency code (e.g., "USD") */
	currency: string;
}

/**
 * Fetch a product's price from the Dodo Payments API.
 */
export async function fetchProductPrice(
	productId: string,
	dodoMode: 'test' | 'live',
	apiKey: string,
): Promise<DodoProductPrice> {
	const baseUrl = BASE_URLS[dodoMode] || BASE_URLS.test;

	const res = await fetch(`${baseUrl}/products/${productId}`, {
		headers: { Authorization: `Bearer ${apiKey}` },
		signal: AbortSignal.timeout(5000),
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Dodo API error ${res.status}: ${body}`);
	}

	const data: { price: { price: number; currency: string } } = await res.json();

	if (typeof data.price?.price !== 'number' || typeof data.price?.currency !== 'string') {
		throw new Error(`Dodo API: unexpected response shape for product ${productId}`);
	}

	return {
		price: data.price.price,
		currency: data.price.currency,
	};
}

/**
 * Format a price in minor units (cents) for display.
 * Uses Intl.NumberFormat for locale-aware currency formatting.
 */
export function formatPrice(cents: number, currency: string): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
	}).format(cents / 100);
}
