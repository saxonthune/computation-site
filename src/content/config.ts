import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    permalink: z.string(),
    redirectFrom: z.array(z.string()).default([]),
    description: z.string().optional(),
    published: z.coerce.date(),
    edited: z.coerce.date().optional(),
    earlyAccess: z.boolean().default(false),
    stub: z.boolean().default(false),
    version: z.number().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
  }),
});

export const collections = { pages, blog };
