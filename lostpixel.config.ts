import { readFileSync } from 'node:fs';
import { z } from 'zod/v4';
import sanitizeFilename from 'sanitize-filename';
import { launchStaticWebServer } from 'lost-pixel/dist/crawler/utils.js';
import type { CustomProjectConfig } from 'lost-pixel';
import type { getSerializedStoryData } from 'histoire/dist/node/build-serialize.js';

const server = await launchStaticWebServer('.histoire/dist');

export const metaInteractSchema = z.union([
  z.array(
    z.array(
      z.union([
        z.object({ click: z.string() }),
        z.object({ hover: z.string() }),
        z.object({ sleep: z.number() }),
      ])
    ).min(1)
  ).min(1),
  z.undefined(),
]);

const histoire = JSON.parse(readFileSync('./.histoire/dist/histoire.json', { encoding: 'utf8' })) as ReturnType<typeof getSerializedStoryData>;

const customPages = histoire.stories.map((story) => {
  const storyInteract = metaInteractSchema.parse(story.meta && 'interact' in story.meta ? story.meta.interact : undefined);

  return story.variants.map((variant) => {
    const variantInteract = metaInteractSchema.parse(variant.meta && 'interact' in variant.meta ? variant.meta.interact : undefined);

    if (storyInteract === undefined && variantInteract === undefined) return undefined;

    return {
      storyId: story.id,
      variantId: variant.id,
      variantTitle: variant.title,
      interact: [
        ...(storyInteract ?? []),
        ...(variantInteract ?? []),
      ] as NonNullable<z.infer<typeof metaInteractSchema>>,
    };
  });
}).flat(
).filter(
  variants => variants !== undefined
).map(variant => variant.interact.map(i => ({
  storyId: variant.storyId,
  variantId: variant.variantId,
  variantTitle: variant.variantTitle,
  interact: i,
}))).flat(
).map((variant) => {
  const url = new URL(server.url);
  url.pathname = '/__sandbox.html';
  url.searchParams.set('storyId', variant.storyId);
  url.searchParams.set('variantId', variant.variantId);
  url.searchParams.set('interact', encodeURIComponent(JSON.stringify(variant.interact)));

  return {
    path: url.pathname + url.search,
    name: sanitizeFilename(`${variant.storyId}_${variant.variantTitle}_${variant.interact.map(op => Object.entries(op).map(pair => pair.join('-')).join('--')).join('---')}`),
  };
});

export const config: CustomProjectConfig = {
  histoireShots: {
    histoireUrl: './.histoire/dist',
  },
  pageShots: {
    pages: customPages,
    baseUrl: server.url,
  },
  beforeScreenshot: async (page) => {
    const url = new URL(page.url());

    const rawInteract = url.searchParams.get('interact');
    if (rawInteract !== null) {
      const interact = JSON.parse(decodeURIComponent(rawInteract)) as NonNullable<z.infer<typeof metaInteractSchema>>[number];

      for (const i of interact) {
        if ('click' in i) await page.click(i.click);
        else if ('hover' in i) await page.locator(i.hover).hover();
        else if ('sleep' in i) await new Promise<void>(res => setTimeout(res, i.sleep));
      }
    }
  },
  generateOnly: true,
  failOnDifference: process.env.LOST_PIXEL_MODE !== 'update',
};
