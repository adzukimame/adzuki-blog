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
  const targetUrl = Array.isArray(query) ? query[0] : query;

  if (!targetUrl || !URL.canParse(targetUrl)) {
    setResponseHeader(event, 'Cache-Control', 'public, max-age=6048000, immutable');

    return createError({
      statusCode: 400,
      message: 'url is required',
    });
  }

  try {
    return await $fetch<SummalyResult>(config.summalyProxyUrl, {
      query: {
        url: targetUrl,
      },
    });
  }
  catch (e) {
    setResponseHeader(event, 'Cache-Control', 'public, max-age=216000, immutable');

    return createError({
      statusCode: 404,
      message: 'Failed to get preview',
    });
  }
});
