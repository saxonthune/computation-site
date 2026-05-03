import { svg, stadium, rect, text, el } from './lib/svg.js';

export const name = 'sdlc-pipeline-ai';

export function render() {
  const ROW_Y = 0, ROW_H = 55, MID = ROW_Y + ROW_H / 2, BOT = ROW_Y + ROW_H;
  const GAP = 10, ARROW_ZONE = 30;

  // Same layout as sdlc-pipeline
  const items = [
    { type: 'stadium', w: 160, label: ['Product', 'Expectations'], color: 'pe' },
    { type: 'rect', w: 110, label: ['Pitch Deck'], color: 'pe' },
    { type: 'rect', w: 100, label: ['PRD'], color: 'pe' },
    { type: 'rect', w: 110, label: ['Jira Ticket'], color: 'pe', rainbow: true },
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

  // Ad-hoc Decisions box
  const jira = positions[3];
  const adHocW = 110, adHocH = 55;
  const adHocX = jira.x - adHocW * 0.3;
  const adHocGap = 25;
  const adHocY = BOT + adHocGap;
  const adHocMidY = adHocY + adHocH / 2;

  // SC tall enough for ad-hoc row
  const sc = positions[4];
  const scTopY = ROW_Y - 15;
  const scH = (adHocY + adHocH + 10) - scTopY;

  const totalW = cursor;
  const bounds = [0, scTopY, totalW, adHocY + adHocH + 5];

  // Rainbow gradient defs
  const defs = el('defs', {}, [
    `<linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="0">`,
    `  <stop offset="0%" stop-color="#ef4444"/>`,
    `  <stop offset="20%" stop-color="#f97316"/>`,
    `  <stop offset="40%" stop-color="#eab308"/>`,
    `  <stop offset="60%" stop-color="#22c55e"/>`,
    `  <stop offset="80%" stop-color="#3b82f6"/>`,
    `  <stop offset="100%" stop-color="#8b5cf6"/>`,
    `</linearGradient>`,
    `<linearGradient id="rainbow-subtle" x1="0" y1="0" x2="1" y2="0.5">`,
    `  <stop offset="0%" stop-color="#ef4444" stop-opacity="0.5"/>`,
    `  <stop offset="20%" stop-color="#f97316" stop-opacity="0.5"/>`,
    `  <stop offset="40%" stop-color="#eab308" stop-opacity="0.5"/>`,
    `  <stop offset="60%" stop-color="#22c55e" stop-opacity="0.5"/>`,
    `  <stop offset="80%" stop-color="#3b82f6" stop-opacity="0.5"/>`,
    `  <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.5"/>`,
    `</linearGradient>`,
  ]);

  const elements = [defs];

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
      // Rainbow border overlay for Jira Ticket
      if (item.rainbow) {
        elements.push(rect(item.x, ROW_Y, item.w, ROW_H, { stroke: 'url(#rainbow-subtle)', fill: 'none', strokeWidth: 3 }));
      }
      elements.push(
        text(item.x + item.w / 2, MID + 5, item.label[0], { fill: stroke, size: 14 }),
      );
    }
  });

  // Draw thinning arrows — last one (Jira→SC) gets rainbow, same size as PRD→Jira
  for (let i = 0; i < positions.length - 1; i++) {
    const x1 = positions[i].x + positions[i].w + GAP;
    const x2 = positions[i + 1].x - GAP;
    const isLast = i === positions.length - 2;
    // Rainbow arrow matches the previous arrow's thickness (PRD→Jira = index 2)
    const thickness = isLast ? arrowThicknesses[2] : arrowThicknesses[i];
    const hs = isLast ? arrowHeadScales[2] : arrowHeadScales[i];
    const fillColor = isLast ? 'url(#rainbow)' : 'var(--fg-muted)';

    elements.push(
      el('rect', {
        x: x1,
        y: MID - thickness / 2,
        width: x2 - hs + thickness / 2 - x1,
        height: thickness,
        rx: thickness / 2,
        fill: fillColor,
      }),
      el('polygon', {
        points: `${x2},${MID} ${x2 - hs},${MID - hs * 0.65} ${x2 - hs},${MID + hs * 0.65}`,
        fill: fillColor,
      }),
    );

    if (isLast) {
      elements.push(
        text((x1 + x2) / 2, MID + 22, 'AI!', { fill: 'url(#rainbow)', size: 14, weight: 700 }),
      );
    }
  }

  // Ad-hoc Decisions box — rainbow highlighted
  elements.push(
    rect(adHocX, adHocY, adHocW, adHocH, { stroke: 'var(--gap)', fill: 'var(--gap-bg)' }),
    rect(adHocX, adHocY, adHocW, adHocH, { stroke: 'url(#rainbow-subtle)', fill: 'none', strokeWidth: 3 }),
    text(adHocX + adHocW / 2, adHocMidY - 2, 'Ad-hoc', { fill: 'var(--gap)', size: 14 }),
    text(adHocX + adHocW / 2, adHocMidY + 14, 'Decisions', { fill: 'var(--gap)', size: 14 }),
  );

  // Rainbow arrow from Ad-hoc → Source Code — same size as Jira→SC arrow
  const adHocRight = adHocX + adHocW;
  const scLeft = sc.x;
  const ax1 = adHocRight + 5;
  const ax2 = scLeft - 5;
  const adHocThickness = arrowThicknesses[2];
  const adHocHs = arrowHeadScales[2];
  elements.push(
    el('rect', { x: ax1, y: adHocMidY - adHocThickness / 2, width: ax2 - adHocHs + adHocThickness / 2 - ax1, height: adHocThickness, rx: adHocThickness / 2, fill: 'url(#rainbow)' }),
    el('polygon', {
      points: `${ax2},${adHocMidY} ${ax2 - adHocHs},${adHocMidY - adHocHs * 0.65} ${ax2 - adHocHs},${adHocMidY + adHocHs * 0.65}`,
      fill: 'url(#rainbow)',
    }),
    text((ax1 + ax2) / 2, adHocMidY + 22, 'AI!', { fill: 'url(#rainbow)', size: 14, weight: 700 }),
  );

  return svg(bounds, '', elements);
}
