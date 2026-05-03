/**
 * Diagram build script.
 * Imports all diagram modules from this directory and writes SVG files to public/diagrams/.
 *
 * Usage:
 *   node src/diagrams/build.js              # build once
 *   node --watch src/diagrams/build.js      # rebuild on change
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../../public/diagrams');

mkdirSync(OUT_DIR, { recursive: true });

// Import all diagram modules — each exports { name: string, render: () => string }
const modules = [
  await import('./two-sources.js'),
  await import('./two-sources-artifacts.js'),
  await import('./sdlc-pipeline.js'),
  await import('./sdlc-pipeline-ai.js'),
  await import('./signal-dilution.js'),
  await import('./spec-groups.js'),
  await import('./spec-reconciliation.js'),
];

for (const mod of modules) {
  const filename = `${mod.name}.svg`;
  writeFileSync(join(OUT_DIR, filename), mod.render());
  console.log(`  wrote ${filename}`);
}

console.log(`Built ${modules.length} diagrams.`);
