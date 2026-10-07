import type { RequestHandler } from './$types';

import { activateLicense } from '#lib/license.js';
import { DODO_MODE } from '$app/env/private';
import { PUBLIC_DODO_PRODUCT_MAP } from '$app/env/public';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	if (!body.key || !body.instance_name) {
		return Response.json({ message: 'Missing required fields: key, instance_name', code: 'VALIDATION_ERROR' }, { status: 400 });
	}

	const mode = DODO_MODE || 'test';
	return activateLicense(body.key, body.instance_name, mode, PUBLIC_DODO_PRODUCT_MAP);
};
