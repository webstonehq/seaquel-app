import { readdirSync, readFileSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';
import { renderOgSvg, type OgData, type Variant } from './og-template.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_DIR = resolve(ROOT, 'src/content/blog');
const OUTPUT_ROOT = resolve(ROOT, 'static/blog');
const ASSETS_DIR = resolve(__dirname, 'assets');
const LOGO_PATH = resolve(ROOT, 'src/lib/components/logo.svelte');
const AVATAR_PATH = resolve(ROOT, 'src/lib/assets/mike_headshot.webp');
const TEMPLATE_PATH = resolve(__dirname, 'og-template.ts');

const WORDS_PER_MINUTE = 220;
const VARIANTS: Variant[] = ['light', 'dark'];

interface Post {
	slug: string;
	data: OgData;
	markdownPath: string;
}

async function loadAvatarDataUri(): Promise<string> {
	// librsvg (used by sharp) doesn't decode WebP inside <image>, so bake the
	// avatar into a PNG data URI at the display size we need.
	const png = await sharp(AVATAR_PATH).resize(144, 144, { fit: 'cover' }).png().toBuffer();
	return `data:image/png;base64,${png.toString('base64')}`;
}

function stripMarkdown(raw: string): string {
	return raw
		// Strip fenced code blocks (```...```)
		.replace(/```[\s\S]*?```/g, ' ')
		// Strip inline code spans (`...`)
		.replace(/`[^`]*`/g, ' ')
		// Strip images (![alt](src)) entirely
		.replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
		// Unwrap links ([text](url)) to keep only the link text
		.replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
		// Strip common markdown syntax chars (#, >, *, _, ~, -)
		.replace(/[#>*_~-]/g, ' ');
}

function formatReadTime(wordCount: number): string {
	const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
	return `${minutes} min read`;
}

function requireStr(field: unknown, name: string, file: string): string {
	if (typeof field !== 'string' || field.trim() === '') {
		throw new Error(`Missing or empty "${name}" frontmatter in ${file}`);
	}
	return field;
}

function collectPosts(avatarDataUri: string): Post[] {
	const entries = readdirSync(BLOG_DIR, { withFileTypes: true });
	const posts: Post[] = [];
	for (const entry of entries) {
		if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
		const markdownPath = join(BLOG_DIR, entry.name);
		const raw = readFileSync(markdownPath, 'utf8');
		const parsed = matter(raw);
		const fm = parsed.data as Record<string, unknown>;
		const title = requireStr(fm.title, 'title', entry.name);
		const date = requireStr(fm.date, 'date', entry.name);
		const author = requireStr(fm.author, 'author', entry.name);
		const body = parsed.content;
		const wordCount = stripMarkdown(body).trim().split(/\s+/).filter(Boolean).length;
		const ogData: OgData = {
			title,
			ogHeadline: typeof fm.ogHeadline === 'string' ? fm.ogHeadline : undefined,
			ogTagline: typeof fm.ogTagline === 'string' ? fm.ogTagline : undefined,
			category: typeof fm.category === 'string' ? fm.category : undefined,
			author,
			avatarDataUri,
			date,
			readTime: formatReadTime(wordCount)
		};
		posts.push({
			slug: entry.name.replace(/\.md$/, ''),
			data: ogData,
			markdownPath
		});
	}
	return posts;
}

function maxSourceMtime(markdownPath: string): number {
	const fontMtimes = ['Inter-Regular.ttf', 'Inter-Medium.ttf', 'Inter-Bold.ttf'].map((f) =>
		statSync(join(ASSETS_DIR, f)).mtimeMs
	);
	return Math.max(
		statSync(markdownPath).mtimeMs,
		statSync(LOGO_PATH).mtimeMs,
		statSync(AVATAR_PATH).mtimeMs,
		statSync(TEMPLATE_PATH).mtimeMs,
		...fontMtimes
	);
}

async function generate(post: Post, force: boolean): Promise<'generated' | 'skipped'> {
	const outDir = join(OUTPUT_ROOT, post.slug);
	mkdirSync(outDir, { recursive: true });
	const sourceMtime = maxSourceMtime(post.markdownPath);
	let generated = false;
	for (const variant of VARIANTS) {
		const outFile = join(outDir, `og-${variant}.webp`);
		if (!force && existsSync(outFile) && statSync(outFile).mtimeMs >= sourceMtime) {
			continue;
		}
		const svg = renderOgSvg(post.data, variant);
		await sharp(Buffer.from(svg)).webp({ quality: 92 }).toFile(outFile);
		generated = true;
	}
	return generated ? 'generated' : 'skipped';
}

async function main(): Promise<void> {
	const force = process.argv.includes('--force');
	const avatarDataUri = await loadAvatarDataUri();
	const posts = collectPosts(avatarDataUri);
	if (posts.length === 0) {
		console.log('No blog posts found.');
		return;
	}
	let generatedCount = 0;
	for (const post of posts) {
		const result = await generate(post, force);
		if (result === 'generated') {
			console.log(`✓ ${post.slug} (generated ${VARIANTS.length} variants)`);
			generatedCount++;
		} else {
			console.log(`↩ ${post.slug} (up-to-date)`);
		}
	}
	console.log(
		`\n${generatedCount} of ${posts.length} post${posts.length === 1 ? '' : 's'} regenerated.`
	);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
