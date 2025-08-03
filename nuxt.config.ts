// https://nuxt.com/docs/api/configuration/nuxt-config

import { resolve } from 'node:path';
import meta from './content/meta.json' with { type: 'json' };

// https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
const extractLowerBits = (number: number, digits: number) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (number === 0) return ALPHABET[0]!.repeat(digits);
  let result = '';
  for (let i = 0; i < digits && number > 0; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    result += ALPHABET[number % ALPHABET.length]!;
    number = Math.floor(number / ALPHABET.length);
  }
  return result.padStart(digits, ALPHABET[0]);
};

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/eslint',
    '@nuxt/scripts',
    '@nuxtjs/turnstile',
    '@nuxt/test-utils/module',
  ],
  runtimeConfig: {
    public: {
      cfWebAnalyticsToken: '',
      ...{
        siteName: 'siteName',
        siteDescription: 'siteDescription',
        authorName: 'authorName',
        authorSocialLinks: [],
        origin: 'https://example.com',
      },
      ...meta,
    },
    summalyProxyUrl: '',
    mediaProxyUrl: '',
    imgAndMediaSrc: [''],
    protectedTexts: '{}',
  },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
  css: [
    '~/assets/css/main.css',
  ],
  content: {
    sources: {
      content: {
        driver: 'fs',
        base: resolve(import.meta.dirname, 'content'),
      },
    },
    ignores: [
      '^\\.',
      '^-',
      '/meta.json$',
    ],
    locales: [
      'ja-JP',
    ],
    markdown: {
      anchorLinks: false,
      toc: {
        depth: 2,
        searchDepth: 2,
      },
      remarkPlugins: {
        'remark-breaks': {},
      },
    },
  },
  vite: {
    css: {
      modules: {
        generateScopedName(name, filename, _css) {
          const id = `${new URL(filename, import.meta.url).pathname.replace(new URL('./', import.meta.url).pathname, '')}-${name}`.replace(/[^a-zA-Z0-9\-_]/g, '-');

          if (process.env.NODE_ENV === 'production') {
            return extractLowerBits(cyrb53(id), 5);
          }
          else {
            return id;
          }
        },
      },
    },
  },
  nitro: {
    sourceMap: false,
    prerender: {
      autoSubfolderIndex: false,
    },
    hooks: {
      'prerender:generate': (route) => {
        // https://nuxt.com/docs/3.x/getting-started/prerendering#prerendergenerate-nitro-hook
        if (/^\/api\/_content\/cache\.\d+\.json$/.exec(route.route)) {
          route.skip = true;
        }
      },
    },
  },
  hooks: {
    'build:manifest': (manifest) => {
      // https://nuxt.com/docs/3.x/getting-started/styling#lcp-advanced-optimizations
      const css = Object.values(manifest).find(options => options.isEntry === true)?.css;
      if (css) {
        for (let i = css.length - 1; i >= 0; i--) {
          if (css[i]?.startsWith('entry.') === true) {
            css.splice(i, 1);
          }
        }
      }
    },
  },
  typescript: {
    // https://github.com/tsconfig/bases?tab=readme-ov-file#strictest-tsconfigjson
    tsConfig: {
      compilerOptions: {
        allowUnusedLabels: false,
        allowUnreachableCode: false,
        // exactOptionalPropertyTypes: true,
        noFallthroughCasesInSwitch: true,
        noImplicitOverride: true,
        noImplicitReturns: true,
        // noPropertyAccessFromIndexSignature: true,
        noUncheckedIndexedAccess: true,
        noUnusedLocals: true,
        noUnusedParameters: true,

        checkJs: true,
      },
    },
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
  compatibilityDate: '2025-05-24',
  srcDir: 'src/',
  telemetry: false,
  $production: {
    nitro: {
      preset: 'cloudflare-pages',
    },
  },
});
