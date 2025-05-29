import { z } from 'zod/v4';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  if (event.method !== 'POST') {
    return createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  // NUXT_***環境変数の値にJSON文字列を設定するとruntimeConfigの該当プロパティの値はオブジェクトになるが、型に反映されていない
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof config.protectedTexts !== 'object' || config.protectedTexts === null) {
    return createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }

  if (getHeader(event, 'Content-Type') !== 'application/json') {
    return createError({ statusCode: 400, statusMessage: 'Bad Request' });
  }

  const requestBodySchema = z.object({
    token: z.string(),
    name: z.string(),
  });

  const body = await readValidatedBody(event, body => requestBodySchema.safeParse(body));

  if (!body.success) {
    return createError({ statusCode: 400, statusMessage: 'Bad Request' });
  }

  const turnstileResult = await verifyTurnstileToken(body.data.token, event);

  const verified = turnstileResult.success;

  if (!verified) {
    return createError({ statusCode: 400, statusMessage: 'Bad Request' });
  }

  // NUXT_***環境変数の値にJSON文字列を設定するとruntimeConfigの該当プロパティの値はオブジェクトになるが、型に反映されていない
  const protectedTexts = config.protectedTexts as unknown as Record<string, unknown>;

  if (!Object.hasOwn(protectedTexts, body.data.name) || typeof protectedTexts[body.data.name] !== 'string') {
    return createError({ statusCode: 400, statusMessage: 'Bad Request' });
  }

  setResponseHeader(event, 'Cache-Control', 'private, no-store');

  setResponseHeader(event, 'Content-Type', 'application/octet-stream');

  const byteArray = new TextEncoder().encode(protectedTexts[body.data.name] as string);

  const randomValues = crypto.getRandomValues(new Uint8Array(byteArray.length));

  setResponseHeader(event, 'X-Attached-Payload', btoa(Array.from(randomValues, byte => String.fromCodePoint(byte)).join('')));

  return byteArray.map((byte, idx) => byte ^ randomValues[idx] as number);
});
