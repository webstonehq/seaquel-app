import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".md"],
  kit: {
    adapter: adapter({ platformProxy: { persist: { path: "../metrics-collector/.wrangler/state/v3" } } }),
    alias: { $modules: "./src/modules" },
  },
  preprocess: [vitePreprocess(), mdsvex({ extensions: [".md"], rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]] })],
};

export default config;
