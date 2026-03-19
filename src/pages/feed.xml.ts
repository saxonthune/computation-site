import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const dispatches = (await getCollection('blog'))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Computation',
    description: 'Software Design, and Assembly Line Software',
    site: context.site,
    items: dispatches.map((entry) => {
      const d = entry.data.date;
      const yy = String(d.getUTCFullYear()).slice(2);
      const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(d.getUTCDate()).padStart(2, '0');
      const name = entry.id.replace(/\.mdoc$/, '');
      const slug = `${yy}${mm}${dd}-${name}`;
      return {
        title: entry.data.title,
        pubDate: entry.data.date,
        description: entry.data.description ?? '',
        link: `/blog/${slug}/`,
      };
    }),
  });
}
