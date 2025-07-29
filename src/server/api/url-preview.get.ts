import type { SummalyResult } from '@misskey-dev/summaly/built/summary';
import { z } from 'zod/v4-mini';

const querySchema = z.object({
  url: z.url(),
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  if (!URL.canParse(config.summalyProxyUrl)) {
    setResponseHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=3600, immutable');

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }

  const query = await getValidatedQuery(event, query => querySchema.safeParse(query));

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'url is required',
    });
  }

  const url = new URL(config.summalyProxyUrl);
  url.searchParams.set('url', query.data.url);

  try {
    const summary = await $fetch<SummalyResult>(url.toString());

    if (typeof config.mediaProxyUrl === 'string' && URL.canParse(config.mediaProxyUrl)) {
      if (summary.icon && URL.canParse(summary.icon)) {
        const proxiedIconUrl = new URL(config.mediaProxyUrl);
        proxiedIconUrl.pathname = 'preview.webp';
        proxiedIconUrl.searchParams.set('url', summary.icon);
        summary.icon = proxiedIconUrl.toString();
      }
      else {
        summary.icon = null;
      }

      if (summary.thumbnail && URL.canParse(summary.thumbnail)) {
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
    setResponseHeader(event, 'Cache-Control', 'public, max-age=300, s-maxage=259200, immutable');

    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Failed to get preview',
    });
  }
});
