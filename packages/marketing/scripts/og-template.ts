import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import opentype from 'opentype.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const FONTS = {
	regular: resolve(__dirname, 'assets/Inter-Regular.ttf'),
	medium: resolve(__dirname, 'assets/Inter-Medium.ttf'),
	bold: resolve(__dirname, 'assets/Inter-Bold.ttf')
};
const LOGO_PATH = resolve(__dirname, '../src/lib/components/logo.svelte');

export type Variant = 'light' | 'dark';
export type Weight = 'regular' | 'medium' | 'bold';

export interface OgData {
	title: string;
	ogHeadline?: string;
	ogTagline?: string;
	category?: string;
	author: string;
	avatarDataUri: string;
	date: string;
	readTime: string;
}

interface Theme {
	background: string;
	foreground: string;
	muted: string;
	subtle: string;
	accent: string;
	accentSoft: string;
	grid: string;
	glow: string;
	glowInner: string;
	pillBorder: string;
	pillBg: string;
	avatarRing: string;
}

const LIGHT: Theme = {
	background: '#FAF7F0',
	foreground: '#0A0A0A',
	muted: '#3F3F46',
	subtle: '#71717A',
	accent: '#C89B1F',
	accentSoft: '#E5B547',
	grid: 'rgba(10, 10, 10, 0.06)',
	glow: 'rgba(240, 177, 0, 0.35)',
	glowInner: 'rgba(240, 177, 0, 0.55)',
	pillBorder: 'rgba(200, 155, 31, 0.45)',
	pillBg: 'rgba(240, 177, 0, 0.10)',
	avatarRing: 'rgba(200, 155, 31, 0.55)'
};

const DARK: Theme = {
	background: '#0A0A0A',
	foreground: '#FAFAFA',
	muted: '#A1A1AA',
	subtle: '#71717A',
	accent: '#F0B100',
	accentSoft: '#D9A200',
	grid: 'rgba(255, 255, 255, 0.04)',
	glow: 'rgba(240, 177, 0, 0.18)',
	glowInner: 'rgba(240, 177, 0, 0.30)',
	pillBorder: 'rgba(240, 177, 0, 0.40)',
	pillBg: 'rgba(240, 177, 0, 0.08)',
	avatarRing: 'rgba(240, 177, 0, 0.55)'
};

const WIDTH = 1200;
const HEIGHT = 630;
const EDGE_X = 80;

const fontCache = new Map<Weight, opentype.Font>();
let logoInnerCache: string | null = null;

function getFont(weight: Weight): opentype.Font {
	let font = fontCache.get(weight);
	if (!font) {
		const buffer = readFileSync(FONTS[weight]);
		font = opentype.parse(
			buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
		);
		fontCache.set(weight, font);
	}
	return font;
}

function getLogoInner(): string {
	if (logoInnerCache === null) {
		const raw = readFileSync(LOGO_PATH, 'utf8');
		const match = raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
		if (!match) throw new Error('Could not find <svg> in logo.svelte');
		logoInnerCache = match[1];
	}
	return logoInnerCache;
}

function textPath(weight: Weight, text: string, x: number, y: number, size: number, color: string): string {
	if (!text) return '';
	const d = getFont(weight).getPath(text, x, y, size).toPathData(2);
	return `<path d="${d}" fill="${color}"/>`;
}

function textWidth(weight: Weight, text: string, size: number): number {
	if (!text) return 0;
	return getFont(weight).getAdvanceWidth(text, size);
}

function trackedWidth(weight: Weight, text: string, size: number, tracking: number): number {
	const chars = [...text];
	let w = 0;
	for (let i = 0; i < chars.length; i++) {
		w += textWidth(weight, chars[i], size);
		if (i < chars.length - 1) w += tracking;
	}
	return w;
}

function trackedText(weight: Weight, text: string, x: number, y: number, size: number, tracking: number, color: string): string {
	const chars = [...text];
	let cursor = x;
	const paths: string[] = [];
	for (let i = 0; i < chars.length; i++) {
		const ch = chars[i];
		paths.push(textPath(weight, ch, cursor, y, size, color));
		const advance = textWidth(weight, ch, size);
		cursor += advance + (i < chars.length - 1 ? tracking : 0);
	}
	return paths.join('');
}

function wrapPlain(weight: Weight, text: string, size: number, maxWidth: number, maxLines: number): string[] {
	const words = text.split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let current = '';
	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word;
		const w = textWidth(weight, candidate, size);
		if (w <= maxWidth || !current) {
			current = candidate;
		} else {
			lines.push(current);
			current = word;
		}
	}
	if (current) lines.push(current);
	if (lines.length > maxLines) {
		const kept = lines.slice(0, maxLines);
		let last = kept[maxLines - 1];
		while (textWidth(weight, `${last}…`, size) > maxWidth && last.length > 1) {
			last = last.replace(/\s*\S+$/, '').trimEnd();
			if (!last) break;
		}
		kept[maxLines - 1] = `${last}…`;
		return kept;
	}
	return lines;
}

function renderLogoMark(color: string, x: number, y: number, size: number): string {
	const inner = getLogoInner().replace(/currentColor/g, color);
	return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 1024 1024" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}

function renderHeart(cx: number, cy: number, size: number, color: string): string {
	const s = size / 24;
	const d = `M12 21.35 l-1.45-1.32 C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3 c1.74 0 3.41.81 4.5 2.09 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5 c 0 3.78-3.4 6.86-8.55 11.54 L12 21.35 z`;
	return `<g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${s})"><path d="${d}" fill="${color}"/></g>`;
}

function formatHeaderDate(iso: string): string {
	const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
	const d = new Date(iso);
	const m = months[d.getUTCMonth()];
	return `${m} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

function renderBackground(theme: Theme): string {
	const gridStep = 60;
	const gridLines: string[] = [];
	for (let gx = gridStep; gx < WIDTH; gx += gridStep) {
		gridLines.push(`<line x1="${gx}" y1="0" x2="${gx}" y2="${HEIGHT}" stroke="${theme.grid}" stroke-width="1"/>`);
	}
	for (let gy = gridStep; gy < HEIGHT; gy += gridStep) {
		gridLines.push(`<line x1="0" y1="${gy}" x2="${WIDTH}" y2="${gy}" stroke="${theme.grid}" stroke-width="1"/>`);
	}
	return `
<defs>
<radialGradient id="glow-tr" cx="90%" cy="0%" r="80%">
<stop offset="0%" stop-color="${theme.glowInner}"/>
<stop offset="45%" stop-color="${theme.glow}" stop-opacity="0.6"/>
<stop offset="100%" stop-color="${theme.glow}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="glow-bl" cx="0%" cy="100%" r="70%">
<stop offset="0%" stop-color="${theme.glow}" stop-opacity="0.5"/>
<stop offset="100%" stop-color="${theme.glow}" stop-opacity="0"/>
</radialGradient>
</defs>
<rect width="${WIDTH}" height="${HEIGHT}" fill="${theme.background}"/>
${gridLines.join('')}
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow-tr)"/>
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow-bl)"/>`;
}

function renderHeader(data: OgData, theme: Theme): string {
	const y = 88;
	const logoSize = 28;
	const logoY = y - 22;
	const brandText = 'Seaquel / Blog';
	const brandX = EDGE_X + logoSize + 12;
	const leftParts = [
		renderLogoMark(theme.accent, EDGE_X, logoY, logoSize),
		textPath('bold', brandText, brandX, y, 18, theme.foreground)
	];

	const rightSize = 13;
	const tracking = 2;
	const date = formatHeaderDate(data.date);
	const cat = (data.category ?? 'Blog post').toUpperCase();
	const bullet = '  •  ';
	const dateWidth = trackedWidth('medium', date, rightSize, tracking);
	const bulletWidth = trackedWidth('medium', bullet, rightSize, 0);
	const catWidth = trackedWidth('bold', cat, rightSize, tracking);
	const totalRightWidth = dateWidth + bulletWidth + catWidth;
	const rightStartX = WIDTH - EDGE_X - totalRightWidth;
	const dateSvg = trackedText('medium', date, rightStartX, y, rightSize, tracking, theme.muted);
	const bulletSvg = trackedText('medium', bullet, rightStartX + dateWidth, y, rightSize, 0, theme.subtle);
	const catSvg = trackedText('bold', cat, rightStartX + dateWidth + bulletWidth, y, rightSize, tracking, theme.foreground);

	return [...leftParts, dateSvg, bulletSvg, catSvg].join('');
}

function renderPill(data: OgData, theme: Theme): string {
	if (!data.category) return '';
	const label = data.category;
	const textSize = 16;
	const iconSize = 14;
	const padX = 18;
	const gap = 8;
	const height = 38;
	const y = 158;
	const labelWidth = textWidth('bold', label, textSize);
	const pillWidth = padX * 2 + iconSize + gap + labelWidth;
	const pillX = (WIDTH - pillWidth) / 2;
	const rx = height / 2;
	const heartCx = pillX + padX + iconSize / 2;
	const heartCy = y + height / 2;
	const textX = pillX + padX + iconSize + gap;
	const textY = y + height / 2 + textSize / 3;
	return `
<rect x="${pillX}" y="${y}" width="${pillWidth}" height="${height}" rx="${rx}" fill="${theme.pillBg}" stroke="${theme.pillBorder}" stroke-width="1"/>
${renderHeart(heartCx, heartCy, iconSize, theme.accent)}
${textPath('bold', label, textX, textY, textSize, theme.accent)}`;
}

function renderHeadline(data: OgData, theme: Theme): string {
	const headline = data.ogHeadline ?? data.title;
	const tagline = data.ogTagline;
	const fontSize = 62;
	const lineHeight = 70;
	const maxWidth = WIDTH - EDGE_X * 2;
	const headlineLines = wrapPlain('bold', headline, fontSize, maxWidth, 2);
	const taglineLines = tagline ? wrapPlain('bold', tagline, fontSize, maxWidth, 1) : [];
	const totalLines = headlineLines.length + taglineLines.length;
	const blockHeight = totalLines * lineHeight;
	const centerY = 370;
	const startY = centerY - blockHeight / 2 + fontSize * 0.85;
	const paths: string[] = [];
	headlineLines.forEach((line, i) => {
		const w = textWidth('bold', line, fontSize);
		const x = (WIDTH - w) / 2;
		const y = startY + i * lineHeight;
		paths.push(textPath('bold', line, x, y, fontSize, theme.foreground));
	});
	taglineLines.forEach((line, i) => {
		const w = textWidth('bold', line, fontSize);
		const x = (WIDTH - w) / 2;
		const y = startY + (headlineLines.length + i) * lineHeight;
		paths.push(textPath('bold', line, x, y, fontSize, theme.accent));
	});
	return paths.join('');
}

function renderAvatar(data: OgData, theme: Theme): string {
	const size = 36;
	const name = data.author;
	const readTime = data.readTime;
	const nameSize = 16;
	const metaSize = 16;
	const gap = 12;
	const nameWidth = textWidth('bold', name, nameSize);
	const bullet = '  ·  ';
	const bulletWidth = textWidth('regular', bullet, metaSize);
	const readWidth = textWidth('regular', readTime, metaSize);
	const total = size + gap + nameWidth + bulletWidth + readWidth;
	const startX = (WIDTH - total) / 2;
	const y = 600;
	const cx = startX + size / 2;
	const cy = y;
	const textBaseline = y + nameSize / 3 + 1;
	const nameX = startX + size + gap;
	const avatarUri = data.avatarDataUri;
	const clipId = 'avatar-clip';
	return `
<defs><clipPath id="${clipId}"><circle cx="${cx}" cy="${cy}" r="${size / 2}"/></clipPath></defs>
<image href="${avatarUri}" x="${startX}" y="${y - size / 2}" width="${size}" height="${size}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="none" stroke="${theme.avatarRing}" stroke-width="1"/>
${textPath('bold', name, nameX, textBaseline, nameSize, theme.foreground)}
${textPath('regular', bullet, nameX + nameWidth, textBaseline, metaSize, theme.subtle)}
${textPath('regular', readTime, nameX + nameWidth + bulletWidth, textBaseline, metaSize, theme.muted)}`;
}

function renderFooter(theme: Theme): string {
	const size = 13;
	const tracking = 2;
	const y = HEIGHT - 36;
	const handCraftedWidth = trackedWidth('bold', 'HAND-CRAFTED.', size, tracking);
	const handCrafted = trackedText('bold', 'HAND-CRAFTED.', EDGE_X, y, size, tracking, theme.subtle);
	const notAI = trackedText('bold', ' NOT AI-WRITTEN.', EDGE_X + handCraftedWidth, y, size, tracking, theme.accent);
	const right = 'SEAQUEL.APP/BLOG';
	const rightWidth = trackedWidth('bold', right, size, tracking);
	const rightSvg = trackedText('bold', right, WIDTH - EDGE_X - rightWidth, y, size, tracking, theme.subtle);
	return handCrafted + notAI + rightSvg;
}

export function renderOgSvg(data: OgData, variant: Variant): string {
	const theme = variant === 'dark' ? DARK : LIGHT;
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
${renderBackground(theme)}
${renderHeader(data, theme)}
${renderPill(data, theme)}
${renderHeadline(data, theme)}
${renderAvatar(data, theme)}
${renderFooter(theme)}
</svg>`;
}
