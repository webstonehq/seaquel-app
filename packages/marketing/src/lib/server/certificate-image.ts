import satori from "satori";
import { initWasm, Resvg } from "@resvg/resvg-wasm";

/**
 * Renders the 1200x630 card that LinkedIn, X and Slack show when someone
 * shares their certificate. The learner's own name on it is the reason anyone
 * posts one, so this is generated per certificate rather than being a single
 * static image.
 *
 * satori turns a JSX-shaped object into SVG; resvg rasterises it to PNG
 * because no social platform accepts SVG for og:image.
 */

export interface CertificateImageInput {
	name: string;
	lessonCount: number;
	challengeCount: number;
	issuedAt: Date;
}

const WIDTH = 1200;
const HEIGHT = 630;

// Both the fonts and the resvg module are expensive to set up and identical
// for every request, so they're memoised for the life of the isolate.
let fontsPromise: Promise<{ regular: ArrayBuffer; semibold: ArrayBuffer }> | null = null;
let wasmPromise: Promise<void> | null = null;

/**
 * Cloudflare's static-asset binding, described structurally: the workers-types
 * `Fetcher` and the global `fetch` disagree on their Request/Response types,
 * and all this needs is the bytes.
 */
export interface AssetFetcher {
	fetch(url: string): Promise<{
		ok: boolean;
		status: number;
		arrayBuffer(): Promise<ArrayBuffer>;
	}>;
}

export interface RenderContext {
	origin: string;
	/** `platform.env.ASSETS` in production; absent in dev and in tests. */
	assets?: AssetFetcher;
}

/**
 * Reads a file we ship as a static asset.
 *
 * On Workers this goes through the ASSETS binding rather than fetching our own
 * URL: a same-origin subrequest would be routed back through the worker, which
 * costs a round trip and risks a loop. Dev and tests fall back to plain fetch.
 */
async function loadAsset(path: string, ctx: RenderContext): Promise<ArrayBuffer> {
	const response = ctx.assets
		? await ctx.assets.fetch(new URL(path, ctx.origin).toString())
		: await fetch(new URL(path, ctx.origin));
	if (!response.ok) throw new Error(`${path} returned ${response.status}`);
	return response.arrayBuffer();
}

function loadFonts(ctx: RenderContext) {
	fontsPromise ??= (async () => {
		const [regular, semibold] = await Promise.all([
			loadAsset("/fonts/inter-400.woff", ctx),
			loadAsset("/fonts/inter-600.woff", ctx)
		]);
		return { regular, semibold };
	})();
	// A failed fetch shouldn't poison every later request.
	fontsPromise.catch(() => (fontsPromise = null));
	return fontsPromise;
}

/**
 * resvg's WASM is read from our own static assets rather than imported. A
 * bundler-level wasm import would need Cloudflare's `?module` suffix, which
 * then breaks in dev and in tests; this works identically everywhere.
 */
function ensureWasm(ctx: RenderContext) {
	wasmPromise ??= (async () => {
		await initWasm(await loadAsset("/resvg.wasm", ctx));
	})().catch((err) => {
		wasmPromise = null;
		throw err;
	});
	return wasmPromise;
}

/** Plain objects in satori's JSX shape, so no JSX transform is needed here. */
function el(type: string, props: Record<string, unknown>) {
	return { type, props };
}

function text(value: string, style: Record<string, unknown>) {
	return el("div", { style, children: value });
}

export async function renderCertificateImage(
	input: CertificateImageInput,
	ctx: RenderContext
): Promise<Uint8Array> {
	const [fonts] = await Promise.all([loadFonts(ctx), ensureWasm(ctx)]);

	const issued = input.issuedAt.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});

	const svg = await satori(
		el("div", {
			style: {
				width: WIDTH,
				height: HEIGHT,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				padding: "72px 80px",
				backgroundColor: "#0b1120",
				// A warm accent edge so the card reads as Seaquel at thumbnail size.
				borderTop: "12px solid #f59e0b",
				fontFamily: "Inter",
				color: "#e2e8f0"
			},
			children: [
				el("div", {
					style: { display: "flex", flexDirection: "column", gap: 8 },
					children: [
						text("SEAQUEL", {
							fontSize: 26,
							fontWeight: 600,
							letterSpacing: 6,
							color: "#f59e0b"
						}),
						text("Certificate of Completion", {
							fontSize: 34,
							fontWeight: 400,
							color: "#94a3b8"
						})
					]
				}),
				el("div", {
					style: { display: "flex", flexDirection: "column", gap: 18 },
					children: [
						text(input.name, {
							fontSize: input.name.length > 28 ? 68 : 86,
							fontWeight: 600,
							color: "#ffffff",
							lineHeight: 1.1
						}),
						text(
							`Completed all ${input.lessonCount} lessons and ${input.challengeCount} SQL challenges`,
							{ fontSize: 30, fontWeight: 400, color: "#cbd5e1" }
						)
					]
				}),
				el("div", {
					style: {
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-end",
						borderTop: "1px solid #1e293b",
						paddingTop: 28
					},
					children: [
						text(issued, { fontSize: 24, fontWeight: 400, color: "#94a3b8" }),
						text("seaquel.app/learn-sql", {
							fontSize: 24,
							fontWeight: 600,
							color: "#f59e0b"
						})
					]
				})
			]
		}) as never,
		{
			width: WIDTH,
			height: HEIGHT,
			fonts: [
				{ name: "Inter", data: fonts.regular, weight: 400, style: "normal" },
				{ name: "Inter", data: fonts.semibold, weight: 600, style: "normal" }
			]
		}
	);

	return new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
}
