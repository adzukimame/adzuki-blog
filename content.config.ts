import { defineCollection, defineContentConfig } from '@nuxt/content';
import { z } from 'zod/v4';

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/*.md',
      schema: z.object({
        category: z.array(z.string()).default([]),
        created: z.iso.date().default('1900-01-01'),
        allowIndex: z.boolean().default(false),
      }),
    }),
    pages: defineCollection({
      type: 'page',
      source: 'pages/*.md',
      schema: z.object({
        category: z.array(z.string()).default([]),
        created: z.iso.date().default('1900-01-01'),
        allowIndex: z.boolean().default(false),
      }),
    }),
  },
});
