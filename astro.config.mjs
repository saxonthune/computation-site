import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import tailwind from '@astrojs/tailwind';
import diagrams from './src/integrations/diagrams.js';

export default defineConfig({
  site: 'https://computation.saxon.zone',
  integrations: [
    diagrams(),
    markdoc(),
    tailwind({ applyBaseStyles: false })
  ],
});
