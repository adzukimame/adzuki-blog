import type { SummalyResult } from '@misskey-dev/summaly/built/summary';
import { z } from 'zod/v4-mini';

const querySchema = z.object({
  url: z.url(),
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  if (!URL.canParse(config.summalyProxyUrl)) {
    setResponseStatus(event, 500);
    setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=600, immutable');
    return;
  }

  const query = await getValidatedQuery(event, query => querySchema.safeParse(query));

  if (!query.success) {
    setResponseStatus(event, 400);
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
    setResponseHeader(event, 'Content-Type', 'text/plain');
    return 'url is required';
  }

  const url = new URL(config.summalyProxyUrl);
  url.searchParams.set('url', query.data.url);

  try {
    const summary = await $fetch<SummalyResult>(url.toString());

    if (typeof config.mediaProxyUrl === 'string' && URL.canParse(config.mediaProxyUrl)) {
      if (summary.icon !== null && URL.canParse(summary.icon)) {
        const proxiedIconUrl = new URL(config.mediaProxyUrl);
        proxiedIconUrl.pathname = 'preview.webp';
        proxiedIconUrl.searchParams.set('url', summary.icon);
        summary.icon = proxiedIconUrl.toString();
      }
      else {
        summary.icon = null;
      }

      if (summary.thumbnail !== null && URL.canParse(summary.thumbnail)) {
        const proxiedThumbnailUrl = new URL(config.mediaProxyUrl);
        proxiedThumbnailUrl.pathname = 'preview.webp';
        proxiedThumbnailUrl.searchParams.set('url', summary.thumbnail);
        summary.thumbnail = proxiedThumbnailUrl.toString();
      }
      else {
        summary.thumbnail = null;
      }
    }

    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=604800, immutable');

    return summary;
  }
  catch {
    setResponseStatus(event, 404);
    setResponseHeader(event, 'Cache-Control', 'public, max-age=86400, s-maxage=604800, immutable');
    setResponseHeader(event, 'Content-Type', 'text/plain');
    return 'Failed to get preview';
  }
});
