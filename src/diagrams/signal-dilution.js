import { svg, stadium, rect, text, el } from './lib/svg.js';

export const name = 'signal-dilution';

export function render() {
  const ROW_Y = 0, ROW_H = 55, MID = ROW_Y + ROW_H / 2;
  const GAP = 10; // space on each side of an arrow (arrow sits in GAP + arrowZone + GAP)
  const ARROW_ZONE = 30; // space allocated for the arrow stem + head

  // Define items left to right: shapes with widths
  const items = [
    { type: 'stadium', w: 160, label: ['Product', 'Expectations'], color: 'pe' },
    { type: 'rect', w: 110, label: ['Pitch Deck'], color: 'pe' },
    { type: 'rect', w: 100, label: ['PRD'], color: 'pe' },
    { type: 'rect', w: 110, label: ['Jira Ticket'], color: 'pe' },
    { type: 'stadium', w: 150, label: ['Source Code'], color: 'sc' },
  ];

  // Arrow thicknesses between each pair — get thinner as signal dilutes
  const arrowThicknesses = [12, 5, 2.5, 1.2];
  const arrowHeadScales = [18, 10, 7, 5];

  // Compute x positions: shape, gap, arrow, gap, shape, gap, arrow, gap, ...
  let cursor = 0;
  const positions = items.map((item, i) => {
    const x = cursor;
    cursor += item.w;
    if (i < items.length - 1) {
      cursor += GAP + ARROW_ZONE + GAP;
    }
    return { ...item, x };
  });

  const totalW = cursor;
  const bounds = [0, ROW_Y, totalW, ROW_Y + ROW_H];

  const elements = [];

  // Draw shapes
  positions.forEach((item) => {
    const fill = `var(--${item.color}-fill)`;
    const stroke = `var(--${item.color})`;

    if (item.type === 'stadium') {
      elements.push(stadium(item.x, ROW_Y, item.w, ROW_H, { stroke, fill }));
    } else {
      elements.push(rect(item.x, ROW_Y, item.w, ROW_H, { stroke, fill }));
    }

    // Labels
    if (item.label.length === 2) {
      elements.push(
        text(item.x + item.w / 2, MID - 2, item.label[0], { fill: stroke, size: 15 }),
        text(item.x + item.w / 2, MID + 14, item.label[1], { fill: stroke, size: 15 }),
      );
    } else {
      elements.push(
        text(item.x + item.w / 2, MID + 5, item.label[0], { fill: stroke, size: item.type === 'stadium' ? 15 : 14 }),
      );
    }
  });

  // Draw arrows between shapes
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

  return svg(bounds, '', elements);
}
