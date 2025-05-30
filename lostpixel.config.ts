import { readFile } from 'node:fs/promises';
import { launchStaticWebServer } from 'lost-pixel/dist/crawler/utils.js';
import { z } from 'zod/v4';
import sanitizeFilename from 'sanitize-filename';
import type { CustomProjectConfig } from 'lost-pixel';
import type { getSerializedStoryData } from 'histoire/src/node/build-serialize.js';

const interactSchema = z.array(z.array(z.union([
  z.object({ click: z.string() }),
  z.object({ hover: z.string() }),
  z.object({ sleep: z.number() }),
])));
type Interact = z.infer<typeof interactSchema>;

const customPages: NonNullable<CustomProjectConfig['pageShots']>['pages']
  = await readFile('./.histoire/dist/histoire.json', { encoding: 'utf8' })
    .then(text => JSON.parse(text))
    .then((histoire: ReturnType<typeof getSerializedStoryData>) =>
      histoire.stories.map((story) => {
        const storyInteract = story.meta && 'interact' in story.meta && Array.isArray(story.meta.interact) ? story.meta.interact as unknown[] : undefined;

        return story.variants.map((variant) => {
          const variantInteract = variant.meta && 'interact' in variant.meta && Array.isArray(variant.meta.interact) ? variant.meta.interact as unknown[] : undefined;

          if (storyInteract !== undefined && variantInteract !== undefined) {
            return {
              storyId: story.id,
              variantId: variant.id,
              variantTitle: variant.title,
              interact: [
                ...(storyInteract.filter(i => Array.isArray(i)) as unknown[][]),
                ...(variantInteract.filter(i => Array.isArray(i)) as unknown[][]),
              ],
            };
          }
          else {
            return undefined;
          }
        });
      }).flat()
        .filter(variant => variant !== undefined)
        .map((variant) => {
          return variant.interact.map((i) => {
            if (i.every(op => op !== null && typeof op === 'object')) {
              return {
                storyId: variant.storyId,
                variantId: variant.variantId,
                variantTitle: variant.variantTitle,
                interact: i,
              };
            }
            else {
              return undefined;
            }
          });
        }).flat()
        .filter(variant => variant !== undefined)
        .map((variant) => {
          const url = new URL(server.url);
          url.pathname = '/__sandbox.html';
          url.searchParams.set('storyId', variant.storyId);
          url.searchParams.set('variantId', variant.variantId);
          url.searchParams.set('interact', encodeURIComponent(JSON.stringify(variant.interact)));

          return {
            path: url.pathname + url.search,
            name: sanitizeFilename(`${variant.storyId}_${variant.variantTitle}_${variant.interact.map(op => Object.entries(op).map(pair => pair.join('-')).join('--')).join('---')}`),
          };
        })
    );

const server = await launchStaticWebServer('.histoire/dist');

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

    if (url.searchParams.has('interact')) {
      const interact: object[] = JSON.parse(decodeURIComponent(url.searchParams.get('interact')!));

      for (const i of interact) {
        if ('click' in i && typeof i.click === 'string') await page.click(i.click);
        else if ('hover' in i && typeof i.hover === 'string') await page.locator(i.hover).hover();
        else if ('sleep' in i && typeof i.sleep === 'number') await new Promise<void>(res => setTimeout(res, i.sleep as number));
      }
    }
  },
  generateOnly: true,
  failOnDifference: process.env.LOST_PIXEL_MODE !== 'update',
};
