// @ts-check
import { z } from 'zod/v4';

export const interactSchema = z.array(z.union([
  z.object({ click: z.string() }),
  z.object({ hover: z.string() }),
  z.object({ sleep: z.number() }),
])).min(1);

export const metaInteractSchema = z.union([
  z.array(interactSchema).min(1),
  z.undefined(),
]);

export const variantSchema = z.object({
  id: z.string(),
  title: z.string(),
  meta: z.optional(z.object({
    interact: metaInteractSchema,
  })),
});

export const serializedStorySchema = z.object({
  stories: z.array(z.object({
    id: z.string(),
    title: z.string(),
    group: z.optional(z.string()),
    variants: z.array(variantSchema),
    meta: z.optional(z.object({
      interact: metaInteractSchema,
    })),
    relativePath: z.string(),
  })),
});
