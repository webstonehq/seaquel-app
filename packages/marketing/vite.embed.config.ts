import { defineConfig } from 'vite';

/**
 * Builds the <seaquel-sql> embed into static/embed so it ships as plain static
 * files at https://seaquel.app/embed/seaquel-sql.js.
 *
 * Not a library build on purpose: lib mode inlines every asset, which would
 * turn PGlite's WASM and data files into megabytes of base64 inside the JS.
 */
export default defineConfig({
	// Relative base: chunks and PGlite's files resolve against the script's own
	// URL, which is on seaquel.app rather than the blog that loaded it.
	base: './',
	publicDir: false,
	build: {
		outDir: 'static/embed',
		emptyOutDir: true,
		target: 'es2022',
		assetsInlineLimit: 0,
		modulePreload: { polyfill: false },
		rollupOptions: {
			input: 'src/embed/seaquel-sql.ts',
			// Nobody imports from the entry, so rollup may fold it into the chunk
			// graph freely instead of emitting a re-export shim.
			preserveEntrySignatures: false,
			output: {
				// Bloggers paste this name, so it can't carry a hash; everything it
				// loads does, so only this one file needs a short cache.
				entryFileNames: 'seaquel-sql.js',
				chunkFileNames: 'chunks/[name]-[hash].js',
				assetFileNames: 'chunks/[name]-[hash][extname]'
			}
		}
	}
});
