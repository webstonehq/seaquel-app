import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex, code_highlighter } from "mdsvex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const copyIcon = `<svg class="code-copy-idle" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const checkIcon = `<svg class="code-copy-done" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

// Wraps every fenced code block in markdown with a copy button. Clicks are
// handled by a single delegated listener in the root layout.
async function highlighter(code, lang) {
  const html = await code_highlighter(code, lang);
  return `<div class="code-block"><button type="button" class="code-copy" data-code-copy aria-label="Copy code" title="Copy code">${copyIcon}${checkIcon}</button>${html}</div>`;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  kit: {
    adapter: adapter({ platformProxy: { persist: { path: "../metrics-collector/.wrangler/state/v3" } } }),
    alias: { $modules: "./src/modules" },
  },
  preprocess: [vitePreprocess(), mdsvex({ extensions: [".md"], highlight: { highlighter }, rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]] })],
};

export default config;
