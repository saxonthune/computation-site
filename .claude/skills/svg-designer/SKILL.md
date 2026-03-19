---
name: svg-designer
description: Design and iterate on SVG diagrams for the site. Use when creating, updating, or modifying diagrams. Maintains a consistent visual language across all diagrams.
argument-hint: [description or file path to draft]
---

# SVG Diagram Designer

You are creating or modifying an SVG diagram for the computation.saxon.zone website. Diagrams are hand-crafted SVGs with a consistent design language that matches the site's theme.

## Steps

### 1. Understand the request

The description may come from:
- The user's prompt (passed as `$ARGUMENTS`)
- A diagram description placeholder in an `.mdoc` file (look for `< diagram. ... >` lines)
- An existing `.svg` file that needs modification

### 2. Check existing diagrams for consistency

Look at existing SVGs in `public/diagrams/` to match the established style. Read any relevant ones before creating new work.

### 3. Plan before drawing

Briefly outline:
- What entities/shapes are needed
- Visual hierarchy (what's most important?)
- Whether existing icon patterns can be reused
- How this diagram relates to the surrounding text

### 4. Write the SVG

Create a standalone `.svg` file in `public/diagrams/`. Every diagram must embed the design tokens below in its `<style>` block.

#### Design tokens (from tailwind.config.mjs)

```css
svg {
  /* Light mode */
  --fg: #111827;           /* near-black, body text */
  --fg-muted: #6b7280;    /* gray-500, secondary text & artifact icons */
  --accent: #2563eb;       /* blue-600, primary accent & role icons */
  --accent-soft: #dbeafe;  /* blue-100, subtle accent fills */
  --gap: #9ca3af;          /* gray-400, gaps/placeholders */
  --gap-bg: #f1f5f9;       /* slate-50, gap region fill */
}
@media (prefers-color-scheme: dark) {
  svg {
    --fg: #e8e2d6;         /* cream, headings */
    --fg-muted: #6b6560;   /* warm gray, secondary */
    --accent: #d4a647;     /* warm gold, primary accent */
    --accent-soft: #2a2520; /* dark warm, subtle accent fills */
    --gap: #6b6560;        /* warm gray, gaps/placeholders */
    --gap-bg: #161412;     /* slightly lighter than bg */
  }
}
```

**Note:** The site uses class-based dark mode (`darkMode: 'class'`), but standalone SVGs loaded via `<img>` can only use `prefers-color-scheme`. This works for most users since OS preference typically matches. If exact sync is needed in the future, consider inlining the SVG.

#### Icon conventions

- **Roles (people):** Stroke-only, using `var(--accent)`, stroke-width 2. Circle head + curved shoulder/body arc.
- **Artifacts (documents, code):** Stroke-only, using `var(--fg-muted)`, stroke-width 1.8. Rectangle with folded corner + faint content lines.
- **Keep icons minimal** — geometric, no fills, consistent stroke weights.

#### General conventions

- `viewBox` based (no fixed width/height), so diagrams scale responsively
- `fill="none"` on the root `<svg>` — stroke-based aesthetic
- Font: `system-ui, -apple-system, sans-serif` for labels
- Labels: `font-weight: 600`, `font-size: 12px`, `text-anchor: middle`
- Use `<g transform="translate(x,y)">` for positioning entity groups
- Use CSS custom properties (`var(--token)`) for all colors — never hardcode

### 5. Embed in content

Tell the user to replace any diagram placeholder with:

```markdoc
{% figure src="/diagrams/<name>.svg" alt="<description>" /%}
```

### 6. Report what was done

- Where the `.svg` source file is
- How to embed it
- Any new icon patterns that could be reused in future diagrams
