import { svg, stadium, text, arrowH } from './lib/svg.js';

export const name = 'two-sources';

export function render() {
  const ROW_Y = 0, ROW_H = 56, MID = ROW_Y + ROW_H / 2;

  // Product Expectations — wider
  const peX = 0, peW = 240;
  // Source Code — narrower
  const scX = 420, scW = 210;

  const arrowX1 = peX + peW + 10;
  const arrowX2 = scX - 10;
  const labelY = MID + 18;

  const bounds = [peX, ROW_Y, scX + scW, labelY + 6];

  return svg(bounds, '', [
    // Product Expectations
    stadium(peX, ROW_Y, peW, ROW_H, { stroke: 'var(--pe)', fill: 'var(--pe-fill)' }),
    text(peX + peW / 2, MID + 5, 'Product Expectations', { fill: 'var(--pe)', size: 15 }),

    // Arrow
    arrowH(arrowX1, arrowX2, MID),

    // Label under arrow
    text((arrowX1 + arrowX2) / 2, labelY, 'Product Signal', { fill: 'var(--fg-muted)', size: 12, weight: 500 }),

    // Source Code
    stadium(scX, ROW_Y, scW, ROW_H, { stroke: 'var(--sc)', fill: 'var(--sc-fill)' }),
    text(scX + scW / 2, MID + 5, 'Source Code', { fill: 'var(--sc)', size: 15 }),
  ]);
}
