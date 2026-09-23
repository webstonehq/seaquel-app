import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	plugins: [tailwindcss(), enhancedImages(), sveltekit(), devtoolsJson()],
	server: {
		// Lets a locally running tenant container reach the dev control plane.
		allowedHosts: ['host.docker.internal'],
		fs: {
			// Allow serving files from static/demo
			allow: ['static/demo']
		}
	},
	optimizeDeps: {
		// PGlite resolves its WASM and data files relative to its own module;
		// pre-bundling moves the module and breaks those URLs.
		exclude: ['@electric-sql/pglite']
	},
	ssr: {
		// layerchart ships .svelte files that Node.js can't import natively
		noExternal: ['layerchart', '@layerstack/tailwind']
	}
});
