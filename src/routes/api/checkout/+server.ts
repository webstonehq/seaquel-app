import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const BASE_URLS: Record<string, string> = {
	test: 'https://test.dodopayments.com',
	live: 'https://live.dodopayments.com',
};

export const POST: RequestHandler = async ({ request }) => {
	const apiKey = env.DODO_API_KEY;
	if (!apiKey) {
		return json({ message: 'Payment service not configured' }, { status: 500 });
	}

	const body = await request.json();
	const { productId, quantity, returnUrl } = body;

	if (!productId) {
		return json({ message: 'Missing product ID' }, { status: 400 });
	}

	const mode = env.DODO_MODE || 'test';
	const baseUrl = BASE_URLS[mode] || BASE_URLS.test;

	const res = await fetch(`${baseUrl}/checkouts`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			product_cart: [{ product_id: productId, quantity: quantity || 1 }],
			return_url: returnUrl,
		}),
	});

	if (!res.ok) {
		const text = await res.text();
		console.error('[checkout] DodoPayments API error:', res.status, text);
		return json({ message: 'Failed to create checkout session' }, { status: 502 });
	}

	const data = await res.json();
	return json({
		sessionId: data.session_id,
		checkoutUrl: data.checkout_url,
	});
};
