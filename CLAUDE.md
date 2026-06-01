# computation-site

Personal website about software design and AI. Built with Astro + Markdoc + Tailwind CSS.

## Stack

- **Astro** - Static site generator
- **Markdoc** - Content format (`.mdoc` files), supports custom tags
- **Tailwind CSS** - Styling, with `@tailwindcss/typography` for prose content

## Design / Look & Feel

The visual identity is "frosted glass over a painting." Most of it lives in `src/styles/global.css` (heavily commented) plus a few tokens in `tailwind.config.mjs`. Read those comments before changing anything visual.

- **Background painting** — `public/bg.jpg` (a luminous/impressionist field) is rendered as a fixed, full-bleed layer via `body::before` (position: fixed, z-index: -1, `cover` anchored `center bottom`). It uses a fixed pseudo-element *instead of* `background-attachment: fixed` because iOS ignores the latter. The image stays put while content scrolls over it; the bottom-anchored crop keeps the warm/pink foreground in view and grades to calmer light up top. `olivetreesgeorgesbraque.jpg` at repo root is a source/alternate, not what's served.
- **Glass content panel** — the `<main>` in both layouts carries the `.glass` class: rounded frosted card (`backdrop-filter: blur + saturate`, translucent bg, hairline border, ambient shadow) floating over the painting, with a small top/bottom margin so the painting peeks above and below. Blur is reduced under 640px (GPU cost / muddiness on phones), and there's an opaque `@supports not` fallback so text never sits on raw painting.
- **Dark mode** — Tailwind `darkMode: 'class'` (`.dark` on `<html>`), toggled by `ThemeToggle.astro`, persisted in `localStorage('theme')`. **Note the two layouts differ:** `Base.astro` defaults to dark unless theme is explicitly `'light'`; `Prose.astro` respects the OS `prefers-color-scheme`. Both glass + painting work in either theme (dark glass is near-black warm). An inline `<script>` in `<head>` sets the class before paint to avoid a flash.
- **Type & color** — headings use Libre Baskerville (`--font-heading`, loaded from Google Fonts in each layout's `<head>`; `font-heading` Tailwind family). Custom tokens in `tailwind.config.mjs`: `accent.light`/`accent.dark` (blue / warm gold) and a warm `dark.*` palette (bg/text/heading/muted) tuned to stay readable over the glass.
- **Layouts** — `Base.astro` (`max-w-lg`, e.g. homepage) and `Prose.astro` (`max-w-3xl` + `@tailwindcss/typography` `prose`, for articles). Both import `global.css` and include `Lightbox.astro` once.

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
- `{% gallery caption="..." %}...{% /gallery %}` - Multi-image unit: a single non-wrapping row of image cells with one shared caption. Holds `gimg` and/or `stack` children. Always one row (cells shrink to share width); on desktop they size by aspect and center as a balanced group.
- `{% gimg src="..." alt="..." /%}` - A caption-less image cell inside a `gallery` (or `stack`).
- `{% stack %}...{% /stack %}` - Groups `gimg`s vertically into one cell of a `gallery` row (used for asymmetric layouts, e.g. two stacked images beside one tall image).

### Image zooming (lightbox)

`Lightbox.astro` is included once per layout (Base + Prose). Any `<img data-zoomable>` opens a native `<dialog>` on click — near-fullscreen on mobile, large centered view on desktop; click or Esc to close. `Figure` and `gimg` images are zoomable automatically.

## Commands

- `npm run dev` - Local dev server
- `npm run build` - Build static site to `dist/`
- `npm run preview` - Preview built site locally
- `npm run deploy` - Build and sync to S3 + invalidate CloudFront

## Deployment

Built locally and synced to S3 bucket `computation-site`, served via CloudFront at `computation.saxon.zone`. `npm run deploy` handles build, sync, and cache invalidation.

## Homepage

`src/pages/index.astro` is a table of contents. Stub entries (future articles) are plain `<li>` items with `text-gray-400` and no link. When an article is ready, replace the stub with a link.
