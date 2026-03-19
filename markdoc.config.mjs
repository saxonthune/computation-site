import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    columns: {
      render: component('./src/components/Columns.astro'),
    },
    column: {
      render: component('./src/components/Column.astro'),
    },
    section: {
      render: component('./src/components/Section.astro'),
      attributes: {
        title: { type: String, required: true },
      },
    },
    figure: {
      render: component('./src/components/Figure.astro'),
      attributes: {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        caption: { type: String },
      },
    },
    embed: {
      render: component('./src/components/Embed.astro'),
      attributes: {
        src: { type: String, required: true },
        title: { type: String },
      },
    },
  },
});
