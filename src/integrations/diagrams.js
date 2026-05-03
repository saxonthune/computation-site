/**
 * Astro integration: builds diagram scripts and watches for changes in dev.
 * Triggers full browser reload on change via Vite's websocket.
 */

import { watch } from 'fs';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIAGRAMS_DIR = join(__dirname, '../diagrams');
const ROOT = join(__dirname, '../..');

function buildDiagrams() {
  execSync('node src/diagrams/build.js', { cwd: ROOT, stdio: 'inherit' });
}

export default function diagramsIntegration() {
  return {
    name: 'diagrams',
    hooks: {
      'astro:config:setup': () => {
        buildDiagrams();
      },
      'astro:server:setup': ({ server }) => {
        let timeout;
        watch(DIAGRAMS_DIR, { recursive: true }, (event, filename) => {
          if (!filename?.endsWith('.js')) return;
          // Debounce rapid changes
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            console.log(`[diagrams] ${filename} changed, rebuilding...`);
            try {
              buildDiagrams();
              server.hot.send({ type: 'full-reload', path: '*' });
            } catch (e) {
              console.error('[diagrams]', e.message);
            }
          }, 100);
        });
      },
    },
  };
}
