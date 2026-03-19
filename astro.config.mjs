import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://computation.saxon.zone',
  integrations: [
    markdoc(),
    tailwind({ applyBaseStyles: false })
  ],
  output: 'static'
});
