import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFileSync, existsSync, statSync } from 'fs';
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
	const filePath = join(process.cwd(), 'static', 'docs', path);

	// If the path is a directory or doesn't exist, try serving index.html
	if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
		const indexPath = join(process.cwd(), 'static', 'docs', path, 'index.html');
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
