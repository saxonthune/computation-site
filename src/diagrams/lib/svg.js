/**
 * Lightweight SVG builder for diagram scripts.
 * Outputs SVG strings — no DOM required.
 */

/** Design tokens embedded in every diagram */
export const TOKENS = `
    svg {
      --fg: #111827;
      --fg-muted: #6b7280;
      --accent: #2563eb;
      --accent-soft: #dbeafe;
      --gap: #6b7280;
      --gap-bg: #f1f5f9;
      --pe: #7c3aed;
      --pe-fill: #ede9fe;
      --sc: #0d9488;
      --sc-fill: #ccfbf1;
    }
    @media (prefers-color-scheme: dark) {
      svg {
        --fg: #e8e2d6;
        --fg-muted: #a09890;
        --accent: #d4a647;
        --accent-soft: #2a2520;
        --gap: #a09890;
        --gap-bg: #2a2520;
        --pe: #d4b0e8;
        --pe-fill: #322238;
        --sc: #a0d4b8;
        --sc-fill: #1e3028;
      }
    }
    text { font-family: system-ui, -apple-system, sans-serif; }
`;

/** Escape text for XML */
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Round number to 1 decimal place for clean SVG output */
function r(n) {
  return Math.round(n * 10) / 10;
}

/** Render attributes object to string */
function attrs(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      const val = typeof v === 'number' ? r(v) : v;
      return `${k}="${esc(String(val))}"`;
    })
    .join(' ');
}

/** Generic SVG element */
export function el(tag, attributes, ...children) {
  const a = attrs(attributes);
  const inner = children.flat().join('\n');
  if (inner) return `<${tag} ${a}>\n${inner}\n</${tag}>`;
  return `<${tag} ${a}/>`;
}

/**
 * Root <svg>. Pass a content bounding box [minX, minY, maxX, maxY]
 * and the viewBox is derived with uniform padding — guaranteed centered.
 */
export function svg(bounds, extraStyles, ...children) {
  const PAD = 20;
  const [minX, minY, maxX, maxY] = bounds;
  const vx = minX - PAD;
  const vy = minY - PAD;
  const vw = (maxX - minX) + PAD * 2;
  const vh = (maxY - minY) + PAD * 2;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(vx)} ${r(vy)} ${r(vw)} ${r(vh)}" fill="none">`,
    `  <style>${TOKENS}${extraStyles || ''}</style>`,
    ...children.flat(),
    `</svg>`
  ].join('\n');
}

/** Text label */
export function text(x, y, label, { fill, size = 13, weight = 600, anchor = 'middle', cls } = {}) {
  const style = [
    `font-size: ${size}px`,
    `font-weight: ${weight}`,
    `text-anchor: ${anchor}`,
    fill ? `fill: ${fill}` : null,
  ].filter(Boolean).join('; ');
  return el('text', { x, y, style, class: cls }, label);
}

/** Stadium shape (rect with fully rounded ends, rx capped at 28px) */
export function stadium(x, y, w, h, { stroke, fill, strokeWidth = 2 } = {}) {
  return el('rect', { x, y, width: w, height: h, rx: Math.min(28, w / 2, h / 2), fill, stroke, 'stroke-width': strokeWidth });
}

/** Rectangle with optional corner radius */
export function rect(x, y, w, h, { stroke, fill, rx = 4, strokeWidth = 2 } = {}) {
  return el('rect', { x, y, width: w, height: h, rx, fill, stroke, 'stroke-width': strokeWidth });
}

/** Stacked rectangle — 2 offset rects behind the main rect for a "stack of papers" look */
export function stack(x, y, w, h, { stroke, fill, rx = 4, strokeWidth = 2, offset = 3 } = {}) {
  const o = offset;
  return [
    // Bottom card (most offset)
    el('rect', { x: x + o * 2, y: y + o * 2, width: w, height: h, rx, fill, stroke, 'stroke-width': strokeWidth }),
    // Middle card
    el('rect', { x: x + o, y: y + o, width: w, height: h, rx, fill, stroke, 'stroke-width': strokeWidth }),
    // Top card (main)
    el('rect', { x, y, width: w, height: h, rx, fill, stroke, 'stroke-width': strokeWidth }),
  ].join('\n');
}

/** Horizontal arrow: line with triangular head. Line extends to tip so the stem is visible through the head. */
export function arrowH(x1, x2, y, { stroke = 'var(--fg-muted)', strokeWidth = 1.5, headSize = 6 } = {}) {
  const hs = headSize;
  return [
    el('line', { x1, y1: y, x2, y2: y, stroke, 'stroke-width': strokeWidth }),
    el('polygon', { points: `${r(x2)},${r(y)} ${r(x2 - hs)},${r(y - hs / 1.3)} ${r(x2 - hs)},${r(y + hs / 1.3)}`, fill: stroke }),
  ].join('\n');
}

/** Bidirectional horizontal arrow: line with arrowheads on both ends */
export function arrowBi(x1, x2, y, { stroke = 'var(--fg-muted)', strokeWidth = 1.5, headSize = 6 } = {}) {
  const hs = headSize;
  return [
    el('line', { x1, y1: y, x2, y2: y, stroke, 'stroke-width': strokeWidth }),
    // Right-pointing head at x2
    el('polygon', { points: `${r(x2)},${r(y)} ${r(x2 - hs)},${r(y - hs / 1.3)} ${r(x2 - hs)},${r(y + hs / 1.3)}`, fill: stroke }),
    // Left-pointing head at x1
    el('polygon', { points: `${r(x1)},${r(y)} ${r(x1 + hs)},${r(y - hs / 1.3)} ${r(x1 + hs)},${r(y + hs / 1.3)}`, fill: stroke }),
  ].join('\n');
}

/** Two-segment skip arrow: diagonal line from (x1,y1) to (bendX, targetY), then horizontal to (endX, targetY) with arrowhead */
export function skipArrow(x1, y1, targetY, endX, { stroke = 'var(--fg-muted)', strokeWidth = 1.5, headSize = 6 } = {}) {
  const dy = targetY - y1;
  const dx = dy * 1.732; // ~30° from horizontal
  const bendX = r(x1 + dx);
  const hs = headSize;
  return [
    el('line', { x1, y1, x2: bendX, y2: targetY, stroke, 'stroke-width': strokeWidth }),
    el('line', { x1: bendX, y1: targetY, x2: r(endX - hs), y2: targetY, stroke, 'stroke-width': strokeWidth }),
    el('polygon', { points: `${r(endX)},${r(targetY)} ${r(endX - hs)},${r(targetY - hs / 1.3)} ${r(endX - hs)},${r(targetY + hs / 1.3)}`, fill: stroke }),
  ].join('\n');
}

/** Group with translate */
export function g(x, y, ...children) {
  return el('g', { transform: `translate(${x},${y})` }, ...children);
}
