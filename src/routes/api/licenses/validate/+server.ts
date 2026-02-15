import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { validateLicense } from '$lib/license';
import { env as publicEnv } from '$env/dynamic/public';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!body.key || !body.instance_id) {
		return json({ message: 'Missing required fields: key, instance_id', code: 'VALIDATION_ERROR' }, { status: 400 });
	}

	const mode = publicEnv.PUBLIC_DODO_MODE || 'test';
	return validateLicense(body.key, body.instance_id, mode, publicEnv.PUBLIC_DODO_PRODUCT_MAP);
};
