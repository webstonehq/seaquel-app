import type { ParamMatcher } from '@sveltejs/kit';
import { isEngine } from '$lib/sql-errors/engines';

// Lets /sql-errors/{engine} share a URL segment with the guides at
// /sql-errors/{slug}; a matched route outranks the plain [slug].
export const match = ((param: string) => isEngine(param)) satisfies ParamMatcher;
