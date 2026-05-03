import { svg, stadium, stack, text, arrowH, el } from './lib/svg.js';

export const name = 'spec-groups';

export function render() {
  // Main row geometry — taller boxes for label + sublabel
  const ROW_Y = 0, ROW_H = 62, MID = ROW_Y + ROW_H / 2, BOT = ROW_Y + ROW_H;
  const ARROW_GAP = 5;
  const STACK_OFFSET = 3;

  // Shapes
  const peX = 0, peW = 160;
  const boxes = [
    { x: 195, w: 120, label: 'Product Strategy' },
    { x: 348, w: 120, label: 'Product Design' },
    { x: 501, w: 120, label: 'Architecture' },
    { x: 654, w: 120, label: 'Code Shape' },
  ];
  const scX = 820, scW = 150;

  // Rainbow arrow underneath — spans from left edge of first box to right edge of last box
  const stackBot = BOT + STACK_OFFSET * 2; // account for stack offset
  const barY = stackBot + 16;
  const barH = 4;
  const barX1 = boxes[0].x;
  const barX2 = boxes[3].x + boxes[3].w;

  // "Spec Groups" label
  const labelY = barY + barH + 16;

  const bounds = [peX, ROW_Y, scX + scW, labelY + 4];

  const defs = el('defs', {}, [
    `<linearGradient id="rainbow-bar" gradientUnits="userSpaceOnUse" x1="${barX1}" y1="0" x2="${barX2}" y2="0">`,
    `  <stop offset="0%" stop-color="#8b5cf6"/>`,
    `  <stop offset="10%" stop-color="#3b82f6"/>`,
    `  <stop offset="20%" stop-color="#22c55e"/>`,
    `  <stop offset="30%" stop-color="#eab308"/>`,
    `  <stop offset="40%" stop-color="#f97316"/>`,
    `  <stop offset="50%" stop-color="#ef4444"/>`,
    `  <stop offset="60%" stop-color="#8b5cf6"/>`,
    `  <stop offset="70%" stop-color="#3b82f6"/>`,
    `  <stop offset="80%" stop-color="#22c55e"/>`,
    `  <stop offset="90%" stop-color="#eab308"/>`,
    `  <stop offset="100%" stop-color="#f97316"/>`,
    `</linearGradient>`,
  ]);

  const elements = [
    defs,

    // Product Expectations
    stadium(peX, ROW_Y + (ROW_H - 55) / 2, peW, 55, { stroke: 'var(--pe)', fill: 'var(--pe-fill)' }),
    text(peX + peW / 2, MID - 2, 'Product', { fill: 'var(--pe)', size: 15 }),
    text(peX + peW / 2, MID + 14, 'Expectations', { fill: 'var(--pe)', size: 15 }),

    // Arrow PE → first box
    arrowH(peX + peW + ARROW_GAP, boxes[0].x - ARROW_GAP, MID),
  ];

  // Spec group stacked boxes + arrows
  boxes.forEach((box, i) => {
    elements.push(
      stack(box.x, ROW_Y, box.w, ROW_H, { stroke: 'var(--pe)', fill: 'var(--pe-fill)', offset: STACK_OFFSET }),
      text(box.x + box.w / 2, MID - 2, box.label, { fill: 'var(--pe)', size: 14 }),
      text(box.x + box.w / 2, MID + 14, '(spec group)', { fill: 'var(--pe)', size: 12, weight: 400 }),
    );

    // Arrow to next — offset x2 to account for stack width
    const nextX = i < boxes.length - 1 ? boxes[i + 1].x : scX;
    elements.push(arrowH(box.x + box.w + STACK_OFFSET * 2 + ARROW_GAP, nextX - ARROW_GAP, MID));
  });

  // Source Code
  elements.push(
    stadium(scX, ROW_Y + (ROW_H - 55) / 2, scW, 55, { stroke: 'var(--sc)', fill: 'var(--sc-fill)' }),
    text(scX + scW / 2, MID + 5, 'Source Code', { fill: 'var(--sc)', size: 15 }),
  );

  // Rainbow arrow spanning the spec group boxes (rect stem + arrowhead)
  const arrowTipX = barX2;
  const arrowHeadSize = 10;
  elements.push(
    el('rect', { x: barX1, y: barY - barH / 2, width: arrowTipX - arrowHeadSize - barX1, height: barH, rx: barH / 2, fill: 'url(#rainbow-bar)' }),
    el('polygon', { points: `${arrowTipX},${barY} ${arrowTipX - arrowHeadSize},${barY - 7} ${arrowTipX - arrowHeadSize},${barY + 7}`, fill: 'url(#rainbow-bar)' }),
  );

  // "AI!" label centered under the rainbow arrow, with rainbow fill
  const specCenter = (barX1 + barX2) / 2;
  elements.push(
    el('text', { x: specCenter, y: labelY, style: 'font-size: 14px; font-weight: 700; text-anchor: middle; fill: url(#rainbow-bar)' }, 'AI!'),
  );

  return svg(bounds, '', elements);
}
