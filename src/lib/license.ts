/**
 * DodoPayments license proxy helpers.
 *
 * The DodoPayments license endpoints (activate, validate, deactivate) are
 * public and do not require an API key. We proxy them server-side to:
 *   - resolve the product tier from the product map
 *   - provide consistent error handling and response shape
 *   - control which environment (test/live) is used
 */

export interface LicenseProxyResponse {
	id: string;
	status: string;
	key: string;
	tier: string;
	activation: number;
	activation_limit: number;
	expires_at: string | null;
	instance_id: string | null;
}

interface DodoActivateResponse {
	id: string;
	business_id: string;
	name: string;
	license_key_id: string;
	created_at: string;
	product?: { product_id: string; name: string | null };
	customer?: { customer_id: string; name: string; email: string };
}

interface DodoValidateResponse {
	valid: boolean;
}

function getBaseUrl(mode: string): string {
	return mode === 'live'
		? 'https://live.dodopayments.com'
		: 'https://test.dodopayments.com';
}

function generateRequestId(): string {
	return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function errorResponse(operation: string, error: unknown, requestId: string): Response {
	const detail = error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : undefined;

	console.error(`[license:${operation}] ${requestId}`, { error: detail, stack });

	return Response.json(
		{ message: `Something went wrong (ref: ${requestId})`, code: 'LICENSE_ERROR' },
		{ status: 400 },
	);
}

function resolveTier(productId: string | undefined, productMapJson?: string): string {
	if (productId && productMapJson) {
		try {
			const productMap: Record<string, string> = JSON.parse(productMapJson);
			if (productMap[productId]) return productMap[productId];
		} catch { /* ignore parse errors */ }
	}
	if (productMapJson) {
		try {
			const productMap: Record<string, string> = JSON.parse(productMapJson);
			const values = Object.values(productMap);
			if (values.length === 1) return values[0];
		} catch { /* ignore parse errors */ }
	}
	return 'personal';
}

async function dodoFetch<T>(baseUrl: string, path: string, body: Record<string, unknown>): Promise<T> {
	const res = await fetch(`${baseUrl}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`DodoPayments API ${res.status}: ${text}`);
	}

	return res.json();
}

export async function activateLicense(
	key: string,
	instanceName: string,
	mode: string,
	productMapJson?: string,
): Promise<Response> {
	const requestId = generateRequestId();
	try {
    const baseUrl = getBaseUrl(mode);
		console.debug(`[license:activate] ${requestId}`, { msg: "Activating license...", key, instanceName });
		const result = await dodoFetch<DodoActivateResponse>(baseUrl, '/licenses/activate', {
			license_key: key,
			name: instanceName,
		});

		const tier = resolveTier(result.product?.product_id, productMapJson);

		const response: LicenseProxyResponse = {
			id: result.license_key_id,
			status: 'active',
			key,
			tier,
			activation: 1,
			activation_limit: 0,
			expires_at: null,
			instance_id: result.id,
		};

		return Response.json(response);
	} catch (error) {
		return errorResponse('activate', error, requestId);
	}
}

export async function validateLicense(
	key: string,
	instanceId: string,
	mode: string,
	productMapJson?: string,
): Promise<Response> {
	const requestId = generateRequestId();
	try {
		const baseUrl = getBaseUrl(mode);
		const result = await dodoFetch<DodoValidateResponse>(baseUrl, '/licenses/validate', {
			license_key: key,
			...(instanceId && { license_key_instance_id: instanceId }),
		});

		const response: LicenseProxyResponse = {
			id: '',
			status: result.valid ? 'active' : 'inactive',
			key,
			tier: resolveTier(undefined, productMapJson),
			activation: 0,
			activation_limit: 0,
			expires_at: null,
			instance_id: instanceId || null,
		};

		return Response.json(response);
	} catch (error) {
		return errorResponse('validate', error, requestId);
	}
}

export async function deactivateLicense(
	key: string,
	instanceId: string,
	mode: string,
	_productMapJson?: string,
): Promise<Response> {
	const requestId = generateRequestId();
	try {
		const baseUrl = getBaseUrl(mode);
		await dodoFetch<void>(baseUrl, '/licenses/deactivate', {
			license_key: key,
			license_key_instance_id: instanceId,
		});

		const response: LicenseProxyResponse = {
			id: '',
			status: 'deactivated',
			key,
			tier: '',
			activation: 0,
			activation_limit: 0,
			expires_at: null,
			instance_id: instanceId,
		};

		return Response.json(response);
	} catch (error) {
		return errorResponse('deactivate', error, requestId);
	}
}
