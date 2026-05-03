---
name: svg-designer
description: Design and iterate on SVG diagrams for the site. Use when creating, updating, or modifying diagrams. Maintains a consistent visual language across all diagrams.
argument-hint: [description or file path to draft]
---

# SVG Diagram Designer

You are creating or modifying an SVG diagram for the computation.saxon.zone website. Diagrams are authored as **JavaScript modules** that output SVG strings, using a shared helper library.

## Architecture

```
src/diagrams/
├── build.js              # Build script — imports all modules, writes SVGs
├── lib/
│   ├── svg.js            # Helper functions: svg(), stadium(), rect(), text(), arrowH(), skipArrow(), g(), el()
│   └── icons.svg         # Reusable icon symbol reference
├── two-sources.js        # Example diagram module
├── two-sources-artifacts.js
└── sdlc-pipeline.js
```

Each diagram module exports `{ name: string, render: () => string }`. The `render()` function returns an SVG string. `build.js` writes each to `public/diagrams/<name>.svg`.

**Dev workflow:** `npm run dev:all` runs `node --watch src/diagrams/build.js` alongside `astro dev`, so editing a diagram script auto-regenerates the SVG and triggers browser hot-reload.

**Build:** `npm run build` runs `build:diagrams` before `astro build`.

## Steps

### 1. Understand the request

The description may come from:
- The user's prompt (passed as `$ARGUMENTS`)
- A diagram description placeholder in an `.mdoc` file (look for `< diagram. ... >` lines)
- An existing diagram module that needs modification

### 2. Check existing diagrams for consistency

Read existing diagram modules in `src/diagrams/` and the helper library in `src/diagrams/lib/svg.js` before creating new work. Reuse existing helpers and patterns.

### 3. Plan before drawing

Briefly outline:
- What entities/shapes are needed
- Visual hierarchy (what's most important?)
- Whether existing helpers and patterns can be reused
- How this diagram relates to the surrounding text

### 4. Write the diagram module

Create a new `.js` file in `src/diagrams/` that exports `name` and `render()`. Use the helpers from `lib/svg.js`:

- `svg(viewBox, extraStyles, children)` — root element with design tokens
- `stadium(x, y, w, h, opts)` — rounded-end rectangle
- `rect(x, y, w, h, opts)` — rectangle with optional corner radius
- `text(x, y, label, opts)` — text label
- `arrowH(x1, x2, y, opts)` — horizontal arrow with triangular head
- `skipArrow(x1, y1, targetY, endX, opts)` — two-segment arrow (diagonal at ~30° then horizontal)
- `g(x, y, ...children)` — group with translate
- `el(tag, attrs, ...children)` — generic SVG element

Then add the module to the `modules` array in `build.js`.

Run `node src/diagrams/build.js` to generate the SVG and verify it builds.

#### Design tokens

Design tokens are embedded automatically by `svg()` from `lib/svg.js`. The current palette:

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--fg` | `#111827` | `#e8e2d6` | Body text |
| `--fg-muted` | `#6b7280` | `#a09890` | Secondary text, arrows |
| `--accent` | `#2563eb` | `#d4a647` | Primary accent, role icons |
| `--accent-soft` | `#dbeafe` | `#2a2520` | Subtle accent fills |
| `--pe` | `#7c3aed` | `#d4b0e8` | Product Expectations stroke |
| `--pe-fill` | `#ede9fe` | `#322238` | Product Expectations fill |
| `--sc` | `#0d9488` | `#a0d4b8` | Source Code stroke |
| `--sc-fill` | `#ccfbf1` | `#1e3028` | Source Code fill |
| `--gap` | `#9ca3af` | `#6b6560` | Gaps/placeholders |
| `--gap-bg` | `#f1f5f9` | `#161412` | Gap region fill |

**Note:** The site uses class-based dark mode (`darkMode: 'class'`), but standalone SVGs loaded via `<img>` can only use `prefers-color-scheme`. This works for most users since OS preference typically matches.

#### Icon conventions

- **Roles (people):** Stroke-only, using `var(--accent)`, stroke-width 2. Circle head + curved shoulder/body arc.
- **Artifacts (documents, code):** Stroke-only, using `var(--fg-muted)`, stroke-width 1.8. Rectangle with folded corner + faint content lines.
- **Keep icons minimal** — geometric, no fills, consistent stroke weights.

See `src/diagrams/lib/icons.svg` for reference symbols.

#### General conventions

- `viewBox` based (no fixed width/height), so diagrams scale responsively
- `fill="none"` on the root `<svg>` — stroke-based aesthetic
- Font: `system-ui, -apple-system, sans-serif` for labels
- Labels: `font-weight: 600`, `font-size: 12-13px`, `text-anchor: middle`
- Use CSS custom properties (`var(--token)`) for all colors — never hardcode
- Prose container is `max-w-3xl` (768px). Sizing rules of thumb:
  - Simple conceptual diagrams: ~4:1 ratio (e.g. 700×170)
  - Multi-entity pipelines: ~3:1 (e.g. 900×250)
  - Multi-row/complex: ~2:1 or shorter

### 5. Embed in content

Insert the figure tag **above** the diagram placeholder line (`< diagram. ... >`), keeping the placeholder intact so the user can remove it when ready:

```markdoc
{% figure src="/diagrams/<name>.svg" alt="<description>" /%}

< diagram. original placeholder text >
```

### 6. Report what was done

- Which diagram module was created/modified
- How to embed it
- Any new helpers or patterns added to `lib/svg.js`
