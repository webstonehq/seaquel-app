import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const MIME_TYPES: Record<string, string> = {
	'.html': 'text/html',
	'.js': 'application/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.wasm': 'application/wasm'
};

export const GET: RequestHandler = async ({ params }) => {
	const path = params.path || 'index.html';
	const filePath = join(process.cwd(), 'static', 'demo', path);

	if (!existsSync(filePath)) {
		// For SPA fallback, serve index.html for non-file paths
		const indexPath = join(process.cwd(), 'static', 'demo', 'index.html');
		if (existsSync(indexPath)) {
			const content = readFileSync(indexPath);
			return new Response(content, {
				headers: { 'Content-Type': 'text/html' }
			});
		}
		throw error(404, 'Not found');
	}

	const ext = '.' + path.split('.').pop();
	const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
	const content = readFileSync(filePath);

	return new Response(content, {
		headers: { 'Content-Type': mimeType }
	});
};
