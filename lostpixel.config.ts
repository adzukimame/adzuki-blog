import { readFileSync } from 'node:fs';
import sjson from 'secure-json-parse';
import { launchStaticWebServer } from 'lost-pixel/dist/crawler/utils.js';
import type { CustomProjectConfig } from 'lost-pixel';
import sanitize from 'sanitize-filename';
import { interactSchema, metaInteractSchema, serializedStorySchema } from './histoire/schema.js';

const server = await launchStaticWebServer('.histoire/dist');

const histoire = serializedStorySchema.parse(sjson.parse(
  readFileSync('./.histoire/dist/histoire.json', { encoding: 'utf8' })
));

const customPages = histoire.stories.flatMap((story) => {
  const storyInteract = metaInteractSchema.parse(story.meta && 'interact' in story.meta ? story.meta.interact : undefined);

  return story.variants.map((variant) => {
    const variantInteract = metaInteractSchema.parse(variant.meta && 'interact' in variant.meta ? variant.meta.interact : undefined);

    return {
      storyId: story.id,
      variantId: variant.id,
      variantTitle: variant.title,
      interact: (storyInteract === undefined && variantInteract === undefined)
        ? undefined
        : [
            ...(storyInteract ?? []),
            ...(variantInteract ?? []),
          ],
    };
  });
}).flatMap(variant => [true, false].map(darkMode => (
  { ...variant, darkMode }
))).flatMap(variant => [true, false].map(verticalLayout => (
  { ...variant, verticalLayout }
))).flatMap(variant => [true, false].map(smallScreen => (
  { ...variant, smallScreen }
))).flatMap((variant) => {
  if (variant.interact === undefined || variant.interact.length === 0) {
    return [{ ...variant, interact: undefined }];
  }
  else {
    return [{ ...variant, interact: undefined }, ...variant.interact.map(i => (
      { ...variant, interact: i }
    ))];
  }
}).filter(
  variant => (variant.interact !== undefined && variant.interact.operation.length > 0) || variant.darkMode || variant.verticalLayout || variant.smallScreen
).filter(
  variant => !(variant.darkMode && variant.verticalLayout) && !(variant.darkMode && variant.smallScreen)
).filter((variant) => {
  if (variant.interact === undefined) return true;
  if (variant.interact.condition === undefined) return true;

  if (variant.interact.condition.darkMode === true && !variant.darkMode) return false;
  if (variant.interact.condition.darkMode === false && variant.darkMode) return false;
  if (variant.interact.condition.verticalLayout === true && !variant.verticalLayout) return false;
  if (variant.interact.condition.verticalLayout === false && variant.verticalLayout) return false;
  if (variant.interact.condition.smallScreen === true && !variant.smallScreen) return false;
  if (variant.interact.condition.smallScreen === false && variant.smallScreen) return false;

  return true;
}).map((variant) => {
  const url = new URL(server.url);
  url.pathname = '/__sandbox.html';

  let name = '';

  if (variant.smallScreen) url.searchParams.set('viewport-size', 'small');
  if (variant.darkMode) url.searchParams.set('preview-dark-mode', '');
  if (variant.verticalLayout) url.searchParams.set('preview-vertical-layout', '');

  const prefix: string[] = [];
  if (variant.smallScreen) prefix.push('smallScreen');
  if (variant.darkMode) prefix.push('darkMode');
  if (variant.verticalLayout) prefix.push('verticalLayout');

  name += prefix.join('-');
  if (prefix.length > 0) name += '_';

  url.searchParams.set('storyId', variant.storyId);
  name += variant.storyId;

  url.searchParams.set('variantId', variant.variantId);
  name += `_${variant.variantTitle}`;

  if (variant.interact !== undefined && variant.interact.operation.length > 0) {
    url.searchParams.set('interact', encodeURIComponent(JSON.stringify(variant.interact.operation)));
    name += '_';
    name += variant.interact.operation.map(op => Object.entries(op).slice(0, 1).map(pair => pair.join('-'))).join('--');
  }

  return {
    path: url.pathname + url.search,
    name: sanitize(name, { replacement: '-' }),
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

    const viewportSize = url.searchParams.get('viewport-size');
    const verticalLayout = url.searchParams.get('preview-vertical-layout') !== null;
    if (viewportSize === 'small') {
      await page.setViewportSize({
        width: verticalLayout ? 375 : 390,
        height: verticalLayout ? 667 : 844,
      });
    }

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
