import type { NuxtRenderHTMLContext } from 'nuxt/app';

// https://github.com/Baroshem/nuxt-security/blob/main/src/runtime/nitro/plugins/30-cspSsgHashes.ts#L7
const INLINE_SCRIPT_RE = /<script(?![^>]*?\bsrc="[\w:.\-\\/]+")[^>]*>([\s\S]*?)<\/script>/gi;

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', async (html, context) => {
    const scriptHashes: string[] = [];

    const props: Extract<keyof NuxtRenderHTMLContext, 'head' | 'bodyPrepend' | 'bodyAppend'>[] = ['head', 'bodyPrepend', 'bodyAppend'];

    for (const prop of props) {
      for (const element of html[prop]) {
        const inlineScripts = element.matchAll(INLINE_SCRIPT_RE);
        for (const [, textWithoutTags] of inlineScripts) {
          if (textWithoutTags.length === 0) {
            continue;
          }

          const hash = btoa(
            new Uint8Array(
              await crypto.subtle.digest(
                'SHA-256',
                new TextEncoder().encode(textWithoutTags)
              )
            ).reduce(
              (acc, val) => acc + String.fromCharCode(val),
              ''
            )
          );
          scriptHashes.push(`'sha256-${hash}'`);
        }
      }
    }

    const scriptSrc = ['\'self\'', 'https://static.cloudflareinsights.com/beacon.min.js', ...scriptHashes].join(' ');

    const runtimeConfig = useRuntimeConfig(context.event);

    const imgAndMediaSrc = Array.isArray(runtimeConfig.imgAndMediaSrc)
      ? ['\'self\'', ...runtimeConfig.imgAndMediaSrc.filter(val => typeof val === 'string')].join(' ')
      : '\'self\'';

    setResponseHeader(context.event, 'Content-Security-Policy',
      `default-src 'self'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src ${imgAndMediaSrc}; media-src ${imgAndMediaSrc}; connect-src 'self' https://cloudflareinsights.com/cdn-cgi/rum${import.meta.dev ? ' ws://localhost:4000/ws' : ''}; font-src https://fonts.gstatic.com; frame-src https:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none';`
    );

    removeResponseHeader(context.event, 'X-Robots-Tag');
  });
});
