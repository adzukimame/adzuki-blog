import { z } from 'zod/v4-mini';

const protectedTextsSchema = z.record(z.string(), z.string());

const requestBodySchema = z.object({
  token: z.string(),
  name: z.string(),
});

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'private, no-store');

  const config = useRuntimeConfig(event);

  const protectedTexts = protectedTextsSchema.safeParse(config.protectedTexts);

  if (!protectedTexts.success) {
    setResponseStatus(event, 500);
    return;
  }

  if (getHeader(event, 'Content-Type') !== 'application/json') {
    setResponseStatus(event, 400);
    return;
  }

  const body = await readValidatedBody(event, body => requestBodySchema.safeParse(body));

  if (!body.success) {
    setResponseStatus(event, 400);
    return;
  }

  const turnstileResult = await verifyTurnstileToken(body.data.token, event);

  const verified = turnstileResult.success;

  if (!verified) {
    setResponseStatus(event, 400);
    return;
  }

  const text = protectedTexts.data[body.data.name];

  if (text === undefined) {
    setResponseStatus(event, 400);
    return;
  }

  setResponseHeader(event, 'Content-Type', 'application/octet-stream');

  const byteArray = new TextEncoder().encode(text);

  const randomValues = crypto.getRandomValues(new Uint8Array(byteArray.byteLength));

  setResponseHeader(event, 'X-Attached-Payload', btoa(Array.from(randomValues, byte => String.fromCodePoint(byte)).join('')));

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- randomValuesのバイト数はbyteArrayのバイト数と同じ
  return byteArray.map((byte, idx) => byte ^ randomValues[idx]!);
});
