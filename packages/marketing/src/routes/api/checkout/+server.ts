import { DODO_API_KEY, DODO_MODE } from '$app/env/private';
import { auth as betterAuth } from '#lib/server/remult/better-auth.js';
import type { RequestHandler } from './$types';

const BASE_URLS: Record<string, string> = {
	test: 'https://test.dodopayments.com',
	live: 'https://live.dodopayments.com',
};

export const POST: RequestHandler = async ({ request }) => {
	const apiKey = DODO_API_KEY;
	if (!apiKey) {
		return Response.json({ message: 'Payment service not configured' }, { status: 500 });
	}

	const body = await request.json();
	const { productId, quantity, returnUrl, discountCode } = body;

	if (!productId) {
		return Response.json({ message: 'Missing product ID' }, { status: 400 });
	}

	// Best-effort: if the buyer is signed in, stamp their userId into the
	// Dodo checkout metadata. The webhook reads it back to set
	// `License.ownerUserId` directly, skipping the email auto-link path.
	// Anonymous buyers (someone hitting /pricing without an account) still
	// work — their License lands with `ownerUserId = ""` and gets claimed
	// by email match on first dashboard visit.
	const session = await betterAuth.api.getSession({ headers: request.headers });

	const ownerUserId = session?.user.id ?? '';
	const mode = DODO_MODE || 'test';
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
			...discountCode && { discount_code: discountCode },
			...ownerUserId && { metadata: { userId: ownerUserId } }
		})
	});

	if (!res.ok) {
		const text = await res.text();
		console.error('[checkout] DodoPayments API error:', res.status, text);
		return Response.json({ message: 'Failed to create checkout session' }, { status: 502 });
	}

	const data = await res.json();
	return Response.json({
		sessionId: data.session_id,
		checkoutUrl: data.checkout_url,
	});
};
