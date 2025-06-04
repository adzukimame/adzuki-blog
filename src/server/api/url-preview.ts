import type { SummalyResult } from '@misskey-dev/summaly/built/summary';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  if (event.method !== 'GET') {
    return createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  if (!URL.canParse(config.summalyProxyUrl)) {
    setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');

    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }

  const query = getQuery(event).url;
  const targetUrl: unknown = Array.isArray(query) ? query[0] : query;

  if (typeof targetUrl !== 'string' || !URL.canParse(targetUrl)) {
    setResponseHeader(event, 'Cache-Control', 'public, max-age=6048000, immutable');

    return createError({
      statusCode: 400,
      message: 'url is required',
    });
  }

  const url = new URL(config.summalyProxyUrl);
  url.searchParams.set('url', targetUrl);

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
        const proxiedThumbnailUrl = new URL(config.summalyProxyUrl);
        proxiedThumbnailUrl.pathname = 'preview.webp';
        proxiedThumbnailUrl.searchParams.set('url', summary.thumbnail);
        summary.thumbnail = proxiedThumbnailUrl.toString();
      }
      else {
        summary.thumbnail = null;
      }
    }

    return summary;
  }
  catch {
    setResponseHeader(event, 'Cache-Control', 'public, max-age=216000, immutable');

    return createError({
      statusCode: 404,
      message: 'Failed to get preview',
    });
  }
});
