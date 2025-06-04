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
    return await $fetch<SummalyResult>(url.toString());
  }
  catch {
    setResponseHeader(event, 'Cache-Control', 'public, max-age=216000, immutable');

    return createError({
      statusCode: 404,
      message: 'Failed to get preview',
    });
  }
});
