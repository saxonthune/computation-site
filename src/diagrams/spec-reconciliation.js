import { svg, stadium, stack, rect, text, arrowH, arrowBi, el } from './lib/svg.js';

export const name = 'spec-reconciliation';

export function render() {
  // Row geometry
  const ROW_H = 62, STACK_OFFSET = 3;
  const TOP_Y = 0, TOP_MID = TOP_Y + ROW_H / 2, TOP_BOT = TOP_Y + ROW_H;
  const ARROW_GAP = 5;

  // Gap between rows — increased for 3 reconciliation arrows
  const ROW_GAP = 80;
  const BOT_Y = TOP_BOT + ROW_GAP;
  const BOT_MID = BOT_Y + ROW_H / 2;

  // Top row shapes (purple, left to right)
  const peX = 0, peW = 160;
  const topBoxes = [
    { x: 195, w: 120, label: 'Product Strategy' },
    { x: 348, w: 120, label: 'Product Design' },
    { x: 501, w: 120, label: 'Architecture' },
    { x: 654, w: 120, label: 'Code Shape' },
  ];

  // Bottom row shapes (green) — Product Design, Architecture, Code Shape
  const botBoxes = [
    { x: 348, w: 120, label: 'Product Design' },
    { x: 501, w: 120, label: 'Architecture' },
    { x: 654, w: 120, label: 'Code Shape' },
  ];
  const scX = 820, scW = 150;

  // Ad-hoc box position (computed here for bounds, drawn later)
  const adHocRightEdge = topBoxes[3].x + topBoxes[3].w + STACK_OFFSET * 2 + 40 + 110;

  // Bounds
  const maxY = BOT_Y + ROW_H + STACK_OFFSET * 2;
  const bounds = [peX, TOP_Y, Math.max(scX + scW, adHocRightEdge), maxY];

  const elements = [];

  // === TOP ROW (purple) ===

  // Product Expectations
  elements.push(
    stadium(peX, TOP_Y + (ROW_H - 55) / 2, peW, 55, { stroke: 'var(--pe)', fill: 'var(--pe-fill)' }),
    text(peX + peW / 2, TOP_MID - 2, 'Product', { fill: 'var(--pe)', size: 15 }),
    text(peX + peW / 2, TOP_MID + 14, 'Expectations', { fill: 'var(--pe)', size: 15 }),
  );

  // Arrow PE → first box
  elements.push(arrowH(peX + peW + ARROW_GAP, topBoxes[0].x - ARROW_GAP, TOP_MID));

  // Top row boxes with bidirectional arrows between them
  topBoxes.forEach((box, i) => {
    elements.push(
      stack(box.x, TOP_Y, box.w, ROW_H, { stroke: 'var(--pe)', fill: 'var(--pe-fill)', offset: STACK_OFFSET }),
      text(box.x + box.w / 2, TOP_MID - 2, box.label, { fill: 'var(--pe)', size: 14 }),
      text(box.x + box.w / 2, TOP_MID + 14, '(spec group)', { fill: 'var(--pe)', size: 12, weight: 400 }),
    );

    if (i < topBoxes.length - 1) {
      const rightEdge = box.x + box.w + STACK_OFFSET * 2 + ARROW_GAP;
      const leftEdge = topBoxes[i + 1].x - ARROW_GAP;
      elements.push(arrowBi(rightEdge, leftEdge, TOP_MID));
    }
  });

  // === Two arrows going down into Source Code ===
  const scTopY = BOT_Y + (ROW_H - 55) / 2;
  const ahDown = 5; // arrowhead size
  const scCx = scX + scW / 2;

  // === Ad-hoc Decisions box — right-justified above SC ===
  const adHocW = 110, adHocH = ROW_H;
  const adHocX = scX + scW - adHocW; // right-aligned with SC
  const adHocY = TOP_Y;
  const adHocMidY = TOP_MID;

  // Arrow 1: Code Shape → L-shaped down to SC (left of ad-hoc, no intersection)
  const csRight = topBoxes[3].x + topBoxes[3].w + STACK_OFFSET * 2;
  const turnX1 = adHocX - 12; // just left of ad-hoc box
  elements.push(
    el('line', { x1: csRight + ARROW_GAP, y1: TOP_MID, x2: turnX1, y2: TOP_MID, stroke: 'var(--fg-muted)', 'stroke-width': 1.5 }),
    el('line', { x1: turnX1, y1: TOP_MID, x2: turnX1, y2: scTopY - 8, stroke: 'var(--fg-muted)', 'stroke-width': 1.5 }),
    el('polygon', { points: `${turnX1},${scTopY} ${turnX1 - ahDown},${scTopY - 8} ${turnX1 + ahDown},${scTopY - 8}`, fill: 'var(--fg-muted)' }),
  );

  // Arrow 2: Ad-hoc → straight down to SC
  const adHocCx = adHocX + adHocW / 2;
  elements.push(
    el('line', { x1: adHocCx, y1: TOP_BOT, x2: adHocCx, y2: scTopY - 8, stroke: 'var(--fg-muted)', 'stroke-width': 1.5 }),
    el('polygon', { points: `${adHocCx},${scTopY} ${adHocCx - ahDown},${scTopY - 8} ${adHocCx + ahDown},${scTopY - 8}`, fill: 'var(--fg-muted)' }),
  );

  elements.push(
    rect(adHocX, adHocY, adHocW, adHocH, { stroke: 'var(--gap)', fill: 'var(--gap-bg)' }),
    text(adHocX + adHocW / 2, adHocMidY - 2, 'Ad-hoc', { fill: 'var(--gap)', size: 14 }),
    text(adHocX + adHocW / 2, adHocMidY + 14, 'Decisions', { fill: 'var(--gap)', size: 14 }),
  );

  // === BOTTOM ROW (green) ===

  // Draw arrows FIRST (lower z) so boxes render on top

  // Three arrows from SC going left, spaced vertically
  const scLeft = scX - ARROW_GAP;
  const hs = 6;
  const arrowSpacing = 8;

  // Arrow targets (right edges of bottom boxes)
  const pdRightBot = botBoxes[0].x + botBoxes[0].w + STACK_OFFSET * 2 + ARROW_GAP;
  const archRightBot = botBoxes[1].x + botBoxes[1].w + STACK_OFFSET * 2 + ARROW_GAP;
  const csRightBot = botBoxes[2].x + botBoxes[2].w + STACK_OFFSET * 2 + ARROW_GAP;

  // Arrow 3 (lowest z, drawn first): SC → Product Design (bottom, BOT_MID + arrowSpacing)
  const pdY = BOT_MID + arrowSpacing;
  elements.push(
    el('line', { x1: scLeft, y1: pdY, x2: pdRightBot, y2: pdY, stroke: 'var(--fg-muted)', 'stroke-width': 1.5 }),
    el('polygon', { points: `${pdRightBot},${pdY} ${pdRightBot + hs},${pdY - hs / 1.3} ${pdRightBot + hs},${pdY + hs / 1.3}`, fill: 'var(--fg-muted)' }),
  );

  // Arrow 2: SC → Architecture (middle, BOT_MID)
  const archY = BOT_MID;
  elements.push(
    el('line', { x1: scLeft, y1: archY, x2: archRightBot, y2: archY, stroke: 'var(--fg-muted)', 'stroke-width': 1.5 }),
    el('polygon', { points: `${archRightBot},${archY} ${archRightBot + hs},${archY - hs / 1.3} ${archRightBot + hs},${archY + hs / 1.3}`, fill: 'var(--fg-muted)' }),
  );

  // Arrow 1 (highest z, drawn last): SC → Code Shape (top, BOT_MID - arrowSpacing)
  const csY = BOT_MID - arrowSpacing;
  elements.push(
    el('line', { x1: scLeft, y1: csY, x2: csRightBot, y2: csY, stroke: 'var(--fg-muted)', 'stroke-width': 1.5 }),
    el('polygon', { points: `${csRightBot},${csY} ${csRightBot + hs},${csY - hs / 1.3} ${csRightBot + hs},${csY + hs / 1.3}`, fill: 'var(--fg-muted)' }),
  );

  // Source Code (drawn after arrows so it's on top)
  elements.push(
    stadium(scX, BOT_Y + (ROW_H - 55) / 2, scW, 55, { stroke: 'var(--sc)', fill: 'var(--sc-fill)' }),
    text(scX + scW / 2, BOT_MID + 5, 'Source Code', { fill: 'var(--sc)', size: 15 }),
  );

  // Bottom row boxes (green) — drawn after arrows so they cover the lines
  botBoxes.forEach((box) => {
    elements.push(
      stack(box.x, BOT_Y, box.w, ROW_H, { stroke: 'var(--sc)', fill: 'var(--sc-fill)', offset: STACK_OFFSET }),
      text(box.x + box.w / 2, BOT_MID - 2, box.label, { fill: 'var(--sc)', size: 14 }),
      text(box.x + box.w / 2, BOT_MID + 14, '(spec group)', { fill: 'var(--sc)', size: 12, weight: 400 }),
    );
  });

  // === RECONCILIATION ARROWS (vertical bidirectional, centered on each matching pair) ===
  const reconHs = 5;
  const reconTop = TOP_BOT + STACK_OFFSET * 2 + 4;
  const reconBot = BOT_Y - 4;

  // One bidi arrow per matching pair: Product Design, Architecture, Code Shape
  const reconCenters = [
    348 + 60,  // Product Design center
    501 + 60,  // Architecture center
    654 + 60,  // Code Shape center
  ];

  reconCenters.forEach((cx) => {
    elements.push(
      el('line', { x1: cx, y1: reconTop + reconHs, x2: cx, y2: reconBot - reconHs, stroke: 'var(--fg-muted)', 'stroke-width': 1.5 }),
      el('polygon', { points: `${cx},${reconTop} ${cx - reconHs},${reconTop + reconHs} ${cx + reconHs},${reconTop + reconHs}`, fill: 'var(--fg-muted)' }),
      el('polygon', { points: `${cx},${reconBot} ${cx - reconHs},${reconBot - reconHs} ${cx + reconHs},${reconBot - reconHs}`, fill: 'var(--fg-muted)' }),
    );
  });

  return svg(bounds, '', elements);
}
