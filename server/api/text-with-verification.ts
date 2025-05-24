export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  if (event.method !== 'POST') {
    return createError({ statusCode: 405 });
  }

  if (typeof config.protectedTexts !== 'object') {
    return createError({ statusCode: 500 });
  }

  const body = await readBody(event);

  const token = body.token;

  if (typeof token !== 'string') {
    return createError({ statusCode: 400 });
  }

  const turnstileResult = await verifyTurnstileToken(token, event);

  const verified = turnstileResult.success;

  if (!verified) {
    return createError({ statusCode: 400 });
  }

  const name = body.name;

  if (typeof name !== 'string') {
    return createError({ statusCode: 400 });
  }

  const protectedTexts = config.protectedTexts as unknown as Record<string, unknown>;

  if (!Object.hasOwn(protectedTexts, name)) {
    return createError({ statusCode: 400 });
  }

  if (typeof protectedTexts[name] !== 'string') {
    return createError({ statusCode: 400 });
  }

  setResponseHeader(event, 'Cache-Control', 'private, no-store');

  setResponseHeader(event, 'Content-Type', 'application/octet-stream');

  const byteArray = new TextEncoder().encode(protectedTexts[name]);

  const randomValues = crypto.getRandomValues(new Uint8Array(byteArray.length));

  setResponseHeader(event, 'X-Attached-Payload', btoa(Array.from(randomValues, byte => String.fromCodePoint(byte)).join('')));

  return byteArray.map((byte, idx) => byte ^ randomValues[idx]);
});
