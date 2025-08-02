import { readFileSync } from 'node:fs';
import sanitizeFilename from 'sanitize-filename';
import sjson from 'secure-json-parse';
import { launchStaticWebServer } from 'lost-pixel/dist/crawler/utils.js';
import type { CustomProjectConfig } from 'lost-pixel';
import { interactSchema, metaInteractSchema, serializedStorySchema } from './histoire/schema.js';

const server = await launchStaticWebServer('.histoire/dist');

const histoire = serializedStorySchema.parse(sjson.parse(
  readFileSync('./.histoire/dist/histoire.json', { encoding: 'utf8' })
));

const customPages = histoire.stories.map((story) => {
  const storyInteract = metaInteractSchema.parse(story.meta && 'interact' in story.meta ? story.meta.interact : undefined);

  return story.variants.map((variant) => {
    const variantInteract = metaInteractSchema.parse(variant.meta && 'interact' in variant.meta ? variant.meta.interact : undefined);

    // if (storyInteract === undefined && variantInteract === undefined) return undefined;

    return {
      storyId: story.id,
      variantId: variant.id,
      variantTitle: variant.title,
      interact: [
        ...(storyInteract ?? []),
        ...(variantInteract ?? []),
      ],
    };
  });
}).flat(
).map(variant => [true, false].map(darkModeFlag => ({
  storyId: variant.storyId,
  variantId: variant.variantId,
  variantTitle: variant.variantTitle,
  darkMode: darkModeFlag,
  interact: variant.interact,
}))).flat(
).map(variant => ([null, 'vertical-rl'] as const).map(writingMode => ({
  storyId: variant.storyId,
  variantId: variant.variantId,
  variantTitle: variant.variantTitle,
  darkMode: variant.darkMode,
  writingMode: writingMode,
  interact: variant.interact,
}))).flat(
).filter(
  variant => variant.interact.length > 0 || variant.darkMode || variant.writingMode !== null
).map((variant) => {
  if (variant.interact.length === 0) {
    variant.interact = [];
    return [{
      storyId: variant.storyId,
      variantId: variant.variantId,
      variantTitle: variant.variantTitle,
      darkMode: variant.darkMode,
      writingMode: variant.writingMode,
      interact: [],
    }];
  }
  else {
    return variant.interact.map(i => ({
      storyId: variant.storyId,
      variantId: variant.variantId,
      variantTitle: variant.variantTitle,
      darkMode: variant.darkMode,
      writingMode: variant.writingMode,
      interact: i,
    }));
  }
}).flat(
).map((variant) => {
  const url = new URL(server.url);
  url.pathname = '/__sandbox.html';

  let name = '';

  url.searchParams.set('storyId', variant.storyId);
  name += variant.storyId;

  url.searchParams.set('variantId', variant.variantId);
  name += `_${variant.variantTitle}`;

  if (variant.darkMode) {
    url.searchParams.set('preview-dark-mode', '');
    name += '_darkMode';
  }

  if (variant.writingMode === 'vertical-rl') {
    url.searchParams.set('preview-writing-mode', 'vertical-rl');
    name += '_verticalRl';
  }

  if (variant.interact.length > 0) {
    url.searchParams.set('interact', encodeURIComponent(JSON.stringify(variant.interact)));
    name += '_';
    name += variant.interact.map(op => Object.entries(op).map(pair => pair.join('-')).join('--')).join('---');
  }

  return {
    path: url.pathname + url.search,
    name: sanitizeFilename(name),
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
      const interact = interactSchema.parse(sjson.parse(decodeURIComponent(rawInteract)));

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
