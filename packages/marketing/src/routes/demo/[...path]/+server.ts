import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFileSync, existsSync, statSync } from 'fs';
import { extname, join, resolve, sep } from 'path';

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

const DEMO_ROOT = resolve(join(process.cwd(), 'static', 'demo'));

function isFile(candidate: string): boolean {
	return existsSync(candidate) && statSync(candidate).isFile();
}

/**
 * Resolve a request path against the prerendered demo build.
 *
 * SvelteKit writes a prerendered route as `<route>.html` next to a `<route>/`
 * directory holding its `__data.json`, so a bare path like `learn/intro` hits
 * the directory first and has to fall through to `learn/intro.html`.
 */
function resolveFile(path: string): string | null {
	for (const candidate of [
		join(DEMO_ROOT, path),
		join(DEMO_ROOT, `${path}.html`),
		join(DEMO_ROOT, path, 'index.html')
	]) {
		// Keep `..` segments in the request path from escaping the demo build.
		const full = resolve(candidate);
		if (full !== DEMO_ROOT && !full.startsWith(DEMO_ROOT + sep)) continue;
		if (isFile(full)) return full;
	}
	return null;
}

export const GET: RequestHandler = async ({ params }) => {
	const path = params.path || 'index.html';

	// Anything unresolved falls back to the SPA shell so client-side routes work.
	const filePath = resolveFile(path) ?? join(DEMO_ROOT, 'index.html');

	if (!isFile(filePath)) {
		throw error(404, 'Not found');
	}

	// Derive the type from the file actually served, not from the request path:
	// `learn/intro` has no extension but resolves to an .html file.
	const mimeType = MIME_TYPES[extname(filePath)] || 'application/octet-stream';

	return new Response(readFileSync(filePath), {
		headers: { 'Content-Type': mimeType }
	});
};
