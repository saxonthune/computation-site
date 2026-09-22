# Project Guide

Personal site about software design and AI. It uses Astro, Markdoc, and Tailwind CSS.

## Commands

- `just dev` starts the local Astro development server.
- `npm run build` builds the static site into `dist/`.
- `npm run preview` serves the built site locally.
- `npm run deploy` builds and deploys to the Cloudflare Pages project `computation`.

## Structure

- `src/content/blog/` contains blog posts as `.mdoc` files.
- `src/content/config.ts` defines the blog collection schema.
- `src/pages/blog/index.astro` lists posts; `src/pages/blog/[slug].astro` generates post pages.
- `src/pages/feed.xml.ts` generates the RSS feed.
- `src/pages/index.astro` is the homepage.
- `src/layouts/` contains the `Base` and `Prose` layouts.
- `src/components/` contains shared Astro components and Markdoc tag renderers.
- `markdoc.config.mjs` defines the custom Markdoc tags.

## Blog content

Each post in `src/content/blog/` needs `title` and `date` frontmatter. `description` is optional.
The published URL is `/blog/YYMMDD-filename`, based on the UTC date and content filename.
The blog index and RSS feed sort posts newest first.

Keep redirects for retired public URLs in `public/_redirects`.

## Design

The visual style is frosted glass over a painting. Shared styling lives in `src/styles/global.css`;
read its comments before changing the visual design. The `Base` layout is for compact pages and
`Prose` is for article pages. Both include the lightbox component.

The theme uses the `dark` class on `<html>` and stores the choice in `localStorage` under `theme`.
New visitors see the light theme unless they have selected dark mode.
