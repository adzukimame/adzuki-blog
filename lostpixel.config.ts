import { launchStaticWebServer } from 'lost-pixel/dist/crawler/utils.js';
import type { CustomProjectConfig } from 'lost-pixel';

const server = await launchStaticWebServer('.histoire/dist');

/* eslint-disable @typescript-eslint/no-explicit-any */
const customPages: NonNullable<CustomProjectConfig['pageShots']>['pages'] = await import('./.histoire/dist/histoire.json').then((histoire) => {
  return histoire.stories.map((story) => {
    const storyShotParams = (story as any).meta?.shotParams;

    return story.variants.map((variant) => {
      const variantShotParams = (variant as any).meta?.shotParams;

      if (storyShotParams === undefined && variantShotParams === undefined) return undefined;

      return {
        storyId: story.id,
        variantId: variant.id,
        variantTitle: variant.title,
        shotParams: { ...storyShotParams, ...variantShotParams },
      };
    });
  }).flat().filter(variant => variant !== undefined).map((variant) => {
    const url = new URL(server.url);
    url.pathname = '/__sandbox.html';
    url.searchParams.set('storyId', variant.storyId);
    url.searchParams.set('variantId', variant.variantId);
    url.searchParams.set('shotParams', encodeURIComponent(JSON.stringify(variant.shotParams)));

    return {
      path: url.pathname + url.search,
      name: `${variant.storyId}_${variant.variantTitle}_${Object.entries(variant.shotParams).map(pair => pair.join('_')).join('-')}`,
    };
  });
});
/* eslint-enable @typescript-eslint/no-explicit-any */

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

    if (url.searchParams.has('shotParams')) {
      const shotParams = JSON.parse(decodeURIComponent(url.searchParams.get('shotParams')!));

      if (shotParams.click) {
        await page.click(shotParams.click);
      }

      if (shotParams.hover) {
        await page.locator(shotParams.hover).hover();
      }
    }
  },
  generateOnly: true,
  failOnDifference: process.env.LOST_PIXEL_MODE !== 'update',
};
