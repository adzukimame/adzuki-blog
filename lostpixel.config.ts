import { launchStaticWebServer } from 'lost-pixel/dist/crawler/utils.js';
import sanitizeFilename from 'sanitize-filename';
import type { CustomProjectConfig } from 'lost-pixel';

const server = await launchStaticWebServer('.histoire/dist');

const customPages: NonNullable<CustomProjectConfig['pageShots']>['pages'] = await import('./.histoire/dist/histoire.json').then((histoire) => {
  return histoire.stories.map((story) => {
    const storyInteract = 'meta' in story && story.meta !== null && typeof story.meta === 'object' && 'interact' in story.meta && Array.isArray(story.meta.interact) ? story.meta?.interact : undefined;

    return story.variants.map((variant) => {
      const variantInteract = 'meta' in variant ? variant.meta?.interact : undefined;

      if (storyInteract === undefined && variantInteract === undefined) return undefined;

      return {
        storyId: story.id,
        variantId: variant.id,
        variantTitle: variant.title,
        interact: [...(storyInteract ?? []), ...(variantInteract ?? [])] as NonNullable<typeof variantInteract>,
      };
    });
  }).flat().filter(variant => variant !== undefined).map((variant) => {
    return variant.interact.map(i => ({
      storyId: variant.storyId,
      variantId: variant.variantId,
      variantTitle: variant.variantTitle,
      interact: i,
    }));
  }).flat().map((variant) => {
    const url = new URL(server.url);
    url.pathname = '/__sandbox.html';
    url.searchParams.set('storyId', variant.storyId);
    url.searchParams.set('variantId', variant.variantId);
    url.searchParams.set('interact', encodeURIComponent(JSON.stringify(variant.interact)));

    return {
      path: url.pathname + url.search,
      name: sanitizeFilename(`${variant.storyId}_${variant.variantTitle}_${variant.interact.map(i => Object.entries(i).map(pair => pair.join('_')).join('_')).join('-')}`),
    };
  });
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

    if (url.searchParams.has('interact')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const interact: any[] = JSON.parse(decodeURIComponent(url.searchParams.get('interact')!));

      for (const i of interact) {
        if (i.click) await page.click(i.click);
        else if (i.hover) await page.locator(i.hover).hover();
        else if (i.sleep) await new Promise<void>(res => setTimeout(res, parseInt(i.sleep)));
      }
    }
  },
  generateOnly: true,
  failOnDifference: process.env.LOST_PIXEL_MODE !== 'update',
};
