# computation-site

Personal website about software design and AI. Built with Astro + Markdoc + Tailwind CSS.

## Stack

- **Astro** - Static site generator
- **Markdoc** - Content format (`.mdoc` files), supports custom tags
- **Tailwind CSS** - Styling, with `@tailwindcss/typography` for prose content

## Project Structure

```
src/
├── content/          # Markdoc content collections
│   ├── config.ts     # Collection schemas (pages, blog)
│   ├── pages/        # Main articles (.mdoc)
│   └── blog/         # Blog posts (.mdoc)
├── components/       # Astro components used as Markdoc tags
├── layouts/          # Base and Prose layouts
└── pages/            # Astro routes
    ├── index.astro   # Homepage / table of contents
    ├── [...slug].astro  # Catch-all route for pages collection
    └── blog/            # Blog routes (/blog, /blog/[slug])
```

## Content Authoring

Articles are `.mdoc` files in `src/content/pages/`. Required frontmatter:

```yaml
---
title: "Article Title"
published: 2026-03-10       # required
edited: 2026-03-15          # optional, shown if present
description: "Short desc"   # optional
version: 1                  # optional
---
```

## Markdoc Tags

Defined in `markdoc.config.mjs`, rendered by components in `src/components/`:

- `{% columns %}{% column %}...{% /column %}{% /columns %}` - Two-column layout
- `{% section title="Name" %}...{% /section %}` - Titled content block
- `{% figure src="./img.png" alt="desc" caption="Fig 1" /%}` - Image with caption
- `{% embed src="https://youtube.com/embed/ID" title="Video" /%}` - Video embed

## Commands

- `npm run dev` - Local dev server
- `npm run build` - Build static site to `dist/`
- `npm run preview` - Preview built site locally
- `npm run deploy` - Build and sync to S3 + invalidate CloudFront

## Deployment

Built locally and synced to S3 bucket `computation-site`, served via CloudFront at `computation.saxon.zone`. `npm run deploy` handles build, sync, and cache invalidation.

## Homepage

`src/pages/index.astro` is a table of contents. Stub entries (future articles) are plain `<li>` items with `text-gray-400` and no link. When an article is ready, replace the stub with a link.
