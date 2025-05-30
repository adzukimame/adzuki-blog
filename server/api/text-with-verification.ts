import { z } from 'zod/v4';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  if (event.method !== 'POST') {
    return createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  const protectedTextsSchema = z.record(z.string(), z.string());

  const protectedTexts = protectedTextsSchema.safeParse(config.protectedTexts);

  if (!protectedTexts.success) {
    return createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }

  if (getHeader(event, 'Content-Type') !== 'application/json') {
    return createError({ statusCode: 400, statusMessage: 'Bad Request' });
  }

  const requestBodySchema = z.object({
    token: z.string(),
    name: z.string(),
  });

  // eslint-disable-next-line @typescript-eslint/unbound-method -- 冗長
  const body = await readValidatedBody(event, requestBodySchema.safeParse);

  if (!body.success) {
    return createError({ statusCode: 400, statusMessage: 'Bad Request' });
  }

  const turnstileResult = await verifyTurnstileToken(body.data.token, event);

  const verified = turnstileResult.success;

  if (!verified) {
    return createError({ statusCode: 400, statusMessage: 'Bad Request' });
  }

  const text = protectedTexts.data[body.data.name];

  if (text === undefined) {
    return createError({ statusCode: 400, statusMessage: 'Bad Request' });
  }

  setResponseHeader(event, 'Cache-Control', 'private, no-store');

  setResponseHeader(event, 'Content-Type', 'application/octet-stream');

  const byteArray = new TextEncoder().encode(text);

  const randomValues = crypto.getRandomValues(new Uint8Array(byteArray.byteLength));

  setResponseHeader(event, 'X-Attached-Payload', btoa(Array.from(randomValues, byte => String.fromCodePoint(byte)).join('')));

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- randomValuesのバイト数はbyteArrayのバイト数と同じ
  return byteArray.map((byte, idx) => byte ^ randomValues[idx]!);
});
