import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { auth as betterAuth } from '$lib/server/remult/better-auth';
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
	const { productId, quantity, returnUrl, discountCode } = body;

	if (!productId) {
		return json({ message: 'Missing product ID' }, { status: 400 });
	}

	// Best-effort: if the buyer is signed in, stamp their userId into the
	// Dodo checkout metadata. The webhook reads it back to set
	// `License.ownerUserId` directly, skipping the email auto-link path.
	// Anonymous buyers (someone hitting /pricing without an account) still
	// work — their License lands with `ownerUserId = ""` and gets claimed
	// by email match on first dashboard visit.
	const session = await betterAuth.api.getSession({ headers: request.headers });
	const ownerUserId = session?.user.id ?? '';

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
			...(discountCode && { discount_code: discountCode }),
			...(ownerUserId && { metadata: { userId: ownerUserId } }),
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
