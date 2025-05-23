export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  if (event.method !== 'GET') {
    return createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  if (typeof config.protectedTexts !== 'object') {
    return createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }

  const protectedTexts = config.protectedTexts as unknown as Record<string, unknown>;

  const name = getQuery(event).name;
  const key = Array.isArray(name) ? name[0] : name;

  if (typeof key !== 'string') {
    return createError({
      statusCode: 400,
      message: 'invalid name',
    });
  }

  if (!Object.hasOwn(protectedTexts, key)) {
    return createError({
      statusCode: 400,
      message: 'invalid name',
    });
  }

  if (typeof protectedTexts[key] !== 'string') {
    return createError({
      statusCode: 400,
      message: 'invalid name',
    });
  }

  setResponseHeader(event, 'Content-Type', 'application/octet-stream');

  const byteArray = new TextEncoder().encode(protectedTexts[key]);

  const randomValues = crypto.getRandomValues(new Uint8Array(byteArray.length));

  setResponseHeader(event, 'X-Attached-Payload', btoa(Array.from(randomValues, byte => String.fromCodePoint(byte)).join('')));

  return byteArray.map((byte, idx) => byte ^ randomValues[idx]);
});
