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

// https://github.com/jyn514/base56/blob/master/base56.py
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
function encodeNumber(number: number): string {
  if (number === 0) {
    return '0';
  }

  let result = '';

  while (number > 0) {
    const index = number % ALPHABET.length;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    result = ALPHABET[index]! + result;
    number = Math.floor(number / ALPHABET.length);
  }

  return result;
}

export default defineNuxtConfig({
  compatibilityDate: '2025-05-24',
  srcDir: 'src/',
  devtools: { enabled: true },
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
  eslint: {
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        checkJs: true,
        noUncheckedIndexedAccess: true,
      },
    },
  },
  css: [
    '@unocss/reset/normalize.css',
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
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  vite: {
    css: {
      modules: {
        generateScopedName(name, filename, _css) {
          const id = `${new URL(filename, import.meta.url).pathname.replace(new URL('./', import.meta.url).pathname, '')}-${name}`.replace(/[\\/.?&=]/g, '-');

          if (process.env.NODE_ENV === 'production') {
            return encodeNumber(cyrb53(id)).substring(0, 5);
          }
          else {
            return id;
          }
        },
      },
    },
  },
  $production: {
    nitro: {
      preset: 'cloudflare-pages',
    },
  },
});
