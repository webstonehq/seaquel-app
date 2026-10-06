# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

Seaquel App is a pnpm monorepo. The primary package is the SvelteKit marketing website for the Seaquel product, located at `packages/marketing/`. It includes landing pages, feature showcases, changelogs, and an embedded demo.

## Tech Stack

- **Monorepo**: pnpm workspaces
- **Framework**: SvelteKit with Svelte 5
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **UI Components**: shadcn-svelte
- **Markdown**: mdsvex for changelog content
- **Deployment**: Cloudflare (adapter-cloudflare)
- **Images**: @sveltejs/enhanced-img for optimized images

## Commands

Run from repository root:

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm check        # TypeScript/Svelte type checking
```

Run from `packages/marketing/`:

```bash
pnpm demo:update  # Update demo from sibling seaquel project
```

## Project Structure

```
packages/
└── marketing/           # SvelteKit marketing website
    ├── src/
    │   ├── routes/              # SvelteKit routes
    │   │   ├── +page.svelte     # Landing page
    │   │   ├── features/        # Features page
    │   │   ├── changelog/       # Changelog listing and detail pages
    │   │   ├── download/        # Download redirect endpoints
    │   │   ├── updates/         # Desktop updater feeds (stable and beta)
    │   │   └── demo/            # Demo proxy endpoints
    │   ├── lib/
    │   │   ├── components/      # Reusable Svelte components
    │   │   │   └── ui/          # UI primitives (button, card, dropdown-menu)
    │   │   ├── changelog/       # Changelog loading utilities
    │   │   ├── assets/          # Images and static assets
    │   │   └── utils.ts         # Utility functions (cn for classnames)
    │   ├── content/
    │   │   └── changelog/       # Markdown changelog entries
    │   └── app.html             # HTML template
    ├── static/
    │   └── demo/                # Built demo from seaquel project
    ├── svelte.config.js
    ├── vite.config.ts
    ├── tsconfig.json
    ├── wrangler.jsonc
    └── components.json
```

## Update Feeds

The desktop app's updater asks `/updates/check/{target}/{arch}/{current_version}` (stable) or `/updates/check/beta/{target}/{arch}/{current_version}` (beta). Both answer through `latestJsonFor` in `packages/marketing/src/lib/server/releases.ts`:

- Stable serves the `latest.json` of the newest published release that isn't a pre-release, by tag version (not GitHub's list order). Cached in KV under `updates:latest-json` for 1h.
- Beta serves the newest published release by version, pre-releases included. Cached under `updates:latest-json:beta` for 10 minutes.
- A tag with a pre-release suffix (`v2026.10.0-beta.3`) never reaches stable or the download page (`findLatestAsset`), even if GitHub's "pre-release" box wasn't ticked.
- Any failure answers 204 (no update).
- Deploy a change to these routes before the app release that depends on it: an app on the Beta channel gets a 404 (and no updates) until the beta route is live.

## Changelog System

Changelog entries are markdown files in `packages/marketing/src/content/changelog/`. Each file requires frontmatter:

```md
---
title: "Release Title"
date: "YYYY-MM-DD"
---

Content here...
```

Files are named by version (e.g., `2026.1.1.md`). The changelog system uses `import.meta.glob` to dynamically load entries.

## UI Components

UI components in `packages/marketing/src/lib/components/ui/` follow the shadcn-svelte pattern with bits-ui primitives. Use the `cn()` utility from `$lib/utils` for conditional classnames.
