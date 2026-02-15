import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { activateLicense } from '$lib/license';
import { env as publicEnv } from '$env/dynamic/public';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!body.key || !body.instance_name) {
		return json({ message: 'Missing required fields: key, instance_name', code: 'VALIDATION_ERROR' }, { status: 400 });
	}

	const mode = publicEnv.PUBLIC_DODO_MODE || 'test';
	return activateLicense(body.key, body.instance_name, mode, publicEnv.PUBLIC_DODO_PRODUCT_MAP);
};
