import type { RequestHandler } from './$types';
import { readFileSync } from 'fs';
import { join } from 'path';

export const GET: RequestHandler = async () => {
	const indexPath = join(process.cwd(), 'static', 'demo', 'index.html');
	const content = readFileSync(indexPath);

	return new Response(content, {
		headers: { 'Content-Type': 'text/html' }
	});
};
