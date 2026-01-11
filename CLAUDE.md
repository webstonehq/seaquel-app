# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

Seaquel App is a SvelteKit marketing website for the Seaquel product. It includes landing pages, feature showcases, changelogs, and an embedded demo.

## Tech Stack

- **Framework**: SvelteKit with Svelte 5
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **UI Components**: shadcn-svelte
- **Markdown**: mdsvex for changelog content
- **Deployment**: Cloudflare (adapter-cloudflare)
- **Images**: @sveltejs/enhanced-img for optimized images

## Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run check        # TypeScript/Svelte type checking
npm run demo:update  # Update demo from sibling seaquel project
```

## Project Structure

```
src/
├── routes/              # SvelteKit routes
│   ├── +page.svelte     # Landing page
│   ├── features/        # Features page
│   ├── changelog/       # Changelog listing and detail pages
│   ├── download/        # Download redirect endpoints
│   └── demo/            # Demo proxy endpoints
├── lib/
│   ├── components/      # Reusable Svelte components
│   │   └── ui/          # UI primitives (button, card, dropdown-menu)
│   ├── changelog/       # Changelog loading utilities
│   ├── assets/          # Images and static assets
│   └── utils.ts         # Utility functions (cn for classnames)
├── content/
│   └── changelog/       # Markdown changelog entries
└── app.html             # HTML template
static/
└── demo/                # Built demo from seaquel project
```

## Changelog System

Changelog entries are markdown files in `src/content/changelog/`. Each file requires frontmatter:

```md
---
title: "Release Title"
date: "YYYY-MM-DD"
---

Content here...
```

Files are named by version (e.g., `2026.1.1.md`). The changelog system uses `import.meta.glob` to dynamically load entries.

## UI Components

UI components in `src/lib/components/ui/` follow the shadcn-svelte pattern with bits-ui primitives. Use the `cn()` utility from `$lib/utils` for conditional classnames.
