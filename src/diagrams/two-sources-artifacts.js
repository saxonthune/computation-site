import { svg, stadium, rect, text, arrowH, el } from './lib/svg.js';

export const name = 'two-sources-artifacts';

export function render() {
  const ROW_H = 58, ROW_Y = 40, MID = ROW_Y + ROW_H / 2;

  // Layout
  const peX = 0, peW = 200;
  const artX = 260, artW = 200, artY = 0, artH = 162;
  const scX = 520, scW = 160;

  // Pill tag helper
  const tags = [
    ['PRDs', 'team wikis'],
    ['Jira tickets', 'Notion'],
    ['README', 'docs, etc.'],
  ];

  const TAG_GAP = 10;
  const TAG_H = 26;
  const tagEls = tags.flatMap((row, ri) => {
    // Measure total row width first
    const widths = row.map(label => label.length * 6.5 + 20);
    const totalW = widths.reduce((a, b) => a + b, 0) + TAG_GAP * (widths.length - 1);
    const startX = artX + (artW - totalW) / 2;
    const ty = artY + 42 + ri * 34;

    let cx = startX;
    return row.flatMap((label, ci) => {
      const tw = widths[ci];
      const tx = cx;
      cx += tw + TAG_GAP;
      return [
        el('rect', { x: tx, y: ty, width: tw, height: TAG_H, rx: 13, fill: 'none', stroke: 'var(--pe)', 'stroke-width': 1.2 }),
        text(tx + tw / 2, ty + 17, label, { fill: 'var(--pe)', size: 12, weight: 500 }),
      ];
    });
  });

  const bounds = [peX, artY, scX + scW, artY + artH];

  return svg(bounds, '', [
    // Product Expectations
    stadium(peX, ROW_Y, peW, ROW_H, { stroke: 'var(--pe)', fill: 'var(--pe-fill)' }),
    text(peX + peW / 2, MID + 4, 'Product Expectations', { fill: 'var(--pe)', size: 15 }),

    // Arrow PE → Artifacts
    arrowH(peX + peW + 10, artX - 6, MID),

    // Artifacts rectangle
    rect(artX, artY, artW, artH, { stroke: 'var(--pe)', fill: 'var(--pe-fill)', rx: 6 }),
    text(artX + artW / 2, artY + 30, 'Artifacts', { fill: 'var(--pe)', size: 16 }),

    // Pill tags
    ...tagEls,

    // Arrow Artifacts → SC
    arrowH(artX + artW + 10, scX - 6, MID),

    // Source Code
    stadium(scX, ROW_Y, scW, ROW_H, { stroke: 'var(--sc)', fill: 'var(--sc-fill)' }),
    text(scX + scW / 2, MID + 4, 'Source Code', { fill: 'var(--sc)', size: 15 }),
  ]);
}
