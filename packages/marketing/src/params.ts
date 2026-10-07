import { defineParams } from '@sveltejs/kit/params';
// Relative with .ts: Node loads this file directly during the build, and
// it doesn't map #lib's .js specifiers to the .ts sources.
import { isEngine } from './lib/sql-errors/engines.ts';

// Lets /sql-errors/{engine} share a URL segment with the guides at
// /sql-errors/{slug}; a matched route outranks the plain [slug].
const matchEngine = (param: string) => isEngine(param);

export const params = defineParams({
	engine: (param) => (matchEngine(param) ? param : undefined)
});
