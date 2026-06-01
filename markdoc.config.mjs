import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

export default defineMarkdocConfig({
  tags: {
    columns: {
      render: component('./src/components/Columns.astro'),
      attributes: {
        class: { type: String },
        caption: { type: String },
      },
    },
    column: {
      render: component('./src/components/Column.astro'),
      attributes: {
        class: { type: String },
      },
    },
    section: {
      render: component('./src/components/Section.astro'),
      attributes: {
        title: { type: String, required: true },
      },
    },
    gallery: {
      render: component('./src/components/Gallery.astro'),
      attributes: {
        caption: { type: String },
        class: { type: String },
      },
    },
    gimg: {
      render: component('./src/components/Gimg.astro'),
      attributes: {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        class: { type: String },
      },
    },
    stack: {
      render: component('./src/components/Stack.astro'),
      attributes: {
        class: { type: String },
      },
    },
    figure: {
      render: component('./src/components/Figure.astro'),
      attributes: {
        src: { type: String, required: true },
        alt: { type: String, required: true },
        caption: { type: String },
        class: { type: String },
        imgClass: { type: String },
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
