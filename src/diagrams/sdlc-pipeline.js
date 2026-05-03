import { svg, stadium, rect, text, arrowH, el } from './lib/svg.js';

export const name = 'sdlc-pipeline';

export function render() {
  const ROW_Y = 0, ROW_H = 55, MID = ROW_Y + ROW_H / 2, BOT = ROW_Y + ROW_H;
  const GAP = 10, ARROW_ZONE = 30;

  // Items: same 3 artifacts as signal-dilution + thinning arrows
  const items = [
    { type: 'stadium', w: 160, label: ['Product', 'Expectations'], color: 'pe' },
    { type: 'rect', w: 110, label: ['Pitch Deck'], color: 'pe' },
    { type: 'rect', w: 100, label: ['PRD'], color: 'pe' },
    { type: 'rect', w: 110, label: ['Jira Ticket'], color: 'pe' },
    { type: 'stadium', w: 150, label: ['Source Code'], color: 'sc' },
  ];

  const arrowThicknesses = [12, 5, 2.5, 1.2];
  const arrowHeadScales = [18, 10, 7, 5];

  // Compute x positions
  let cursor = 0;
  const positions = items.map((item, i) => {
    const x = cursor;
    cursor += item.w;
    if (i < items.length - 1) cursor += GAP + ARROW_ZONE + GAP;
    return { ...item, x };
  });

  // Ad-hoc Decisions box — below Jira Ticket, offset left 30%
  const jira = positions[3];
  const adHocW = 110, adHocH = 55;
  const adHocX = jira.x - adHocW * 0.3;
  const adHocGap = 25;
  const adHocY = BOT + adHocGap;
  const adHocMidY = adHocY + adHocH / 2;

  // SC needs to be tall enough to reach ad-hoc row
  const sc = positions[4];
  const scTopY = ROW_Y - 15;
  const scH = (adHocY + adHocH + 10) - scTopY;

  const totalW = cursor;
  const bounds = [0, scTopY, totalW, adHocY + adHocH + 5];

  const elements = [];

  // Draw shapes
  positions.forEach((item, i) => {
    const fill = `var(--${item.color}-fill)`;
    const stroke = `var(--${item.color})`;

    if (i === 4) {
      // Source Code — tall stadium
      elements.push(stadium(item.x, scTopY, item.w, scH, { stroke, fill }));
      elements.push(
        text(item.x + item.w / 2, scTopY + scH / 2 - 3, 'Source', { fill: stroke, size: 15 }),
        text(item.x + item.w / 2, scTopY + scH / 2 + 12, 'Code', { fill: stroke, size: 15 }),
      );
    } else if (item.type === 'stadium') {
      elements.push(stadium(item.x, ROW_Y, item.w, ROW_H, { stroke, fill }));
      if (item.label.length === 2) {
        elements.push(
          text(item.x + item.w / 2, MID - 2, item.label[0], { fill: stroke, size: 15 }),
          text(item.x + item.w / 2, MID + 14, item.label[1], { fill: stroke, size: 15 }),
        );
      }
    } else {
      elements.push(rect(item.x, ROW_Y, item.w, ROW_H, { stroke, fill }));
      elements.push(
        text(item.x + item.w / 2, MID + 5, item.label[0], { fill: stroke, size: 14 }),
      );
    }
  });

  // Draw thinning arrows between shapes
  for (let i = 0; i < positions.length - 1; i++) {
    const x1 = positions[i].x + positions[i].w + GAP;
    const x2 = positions[i + 1].x - GAP;
    const thickness = arrowThicknesses[i];
    const hs = arrowHeadScales[i];

    elements.push(
      el('rect', {
        x: x1,
        y: MID - thickness / 2,
        width: x2 - hs + thickness / 2 - x1,
        height: thickness,
        rx: thickness / 2,
        fill: 'var(--fg-muted)',
      }),
      el('polygon', {
        points: `${x2},${MID} ${x2 - hs},${MID - hs * 0.65} ${x2 - hs},${MID + hs * 0.65}`,
        fill: 'var(--fg-muted)',
      }),
    );
  }

  // Ad-hoc Decisions box
  elements.push(
    rect(adHocX, adHocY, adHocW, adHocH, { stroke: 'var(--gap)', fill: 'var(--gap-bg)' }),
    text(adHocX + adHocW / 2, adHocMidY - 2, 'Ad-hoc', { fill: 'var(--gap)', size: 14 }),
    text(adHocX + adHocW / 2, adHocMidY + 14, 'Decisions', { fill: 'var(--gap)', size: 14 }),
  );

  // Small arrow from Ad-hoc → Source Code
  const adHocRight = adHocX + adHocW;
  const scLeft = sc.x;
  const hs = 6;
  elements.push(
    el('line', { x1: adHocRight + 5, y1: adHocMidY, x2: scLeft - 5, y2: adHocMidY, stroke: 'var(--fg-muted)', 'stroke-width': 1.5 }),
    el('polygon', {
      points: `${scLeft - 5},${adHocMidY} ${scLeft - 5 - hs},${adHocMidY - hs / 1.3} ${scLeft - 5 - hs},${adHocMidY + hs / 1.3}`,
      fill: 'var(--fg-muted)',
    }),
  );

  return svg(bounds, '', elements);
}
