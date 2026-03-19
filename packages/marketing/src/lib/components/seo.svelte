<script lang="ts">
	import { page } from "$app/state";

	interface Props {
		title: string;
		description: string;
		ogTitle?: string;
		ogDescription?: string;
		ogType?: string;
		ogImage?: string;
		twitterCard?: string;
	}

	let {
		title,
		description,
		ogTitle,
		ogDescription,
		ogType = "website",
		ogImage = "/product-screenshot.png",
		twitterCard = "summary_large_image",
	}: Props = $props();

	const origin = "https://seaquel.app";
	let canonicalUrl = $derived(`${origin}${page.url.pathname}`);
	let absoluteImage = $derived(ogImage.startsWith("http") ? ogImage : `${origin}${ogImage}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={ogTitle ?? title} />
	<meta property="og:description" content={ogDescription ?? description} />
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={absoluteImage} />
	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:title" content={ogTitle ?? title} />
	<meta name="twitter:description" content={ogDescription ?? description} />
	<meta name="twitter:image" content={absoluteImage} />
</svelte:head>
