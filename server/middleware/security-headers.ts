export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Origin-Agent-Cluster': '?1',
    'Referrer-Policy': 'same-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '0',
    'Permissions-Policy': 'microphone=(), camera=(), geolocation=()',
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai',
    // eslint-disable-next-line @stylistic/quotes
    'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline' 'self'; img-src 'self'; media-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';",
  });

  const secFetchSite = getRequestHeader(event, 'Sec-Fetch-Site');
  const secFetchMode = getRequestHeader(event, 'Sec-Fetch-Mode');
  const secFetchDest = getRequestHeader(event, 'Sec-Fetch-Dest');

  if (secFetchSite === 'same-site' || secFetchSite === 'cross-site') {
    if (event.method === 'GET' && secFetchMode === 'navigate' && secFetchDest === 'document') {
      // allow
    }
    else if (event.method === 'GET' && secFetchMode === 'navigate' && secFetchDest === 'empty') {
      // allow
    }
    else {
      // eslint-disable-next-line @stylistic/quotes
      setResponseHeader(event, 'Content-Security-Policy', "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';");

      throw createError({
        statusCode: 400,
      });
    }
  }
});
