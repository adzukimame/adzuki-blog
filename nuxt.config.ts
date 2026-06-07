// https://nuxt.com/docs/api/configuration/nuxt-config

// import { resolve } from 'node:path';
import svgLoader from 'vite-svg-loader';
import tailwindcss from '@tailwindcss/vite';

import meta from './content/meta.json' with { type: 'json' };

// https://github.com/tsconfig/bases?tab=readme-ov-file#strictest-tsconfigjson
const tsConfig = {
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
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    build: {
      markdown: {
        toc: {
          depth: 2,
          searchDepth: 2,
        },
        remarkPlugins: {
          'remark-breaks': {},
        },
        highlight: {
          theme: {
            default: 'github-light',
            light: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
    renderer: {
      anchorLinks: false,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      svgLoader({
        svgo: false,
      }),
    ],
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
    typescript: {
      tsConfig: tsConfig,
    },
  },
  // Nuxt 4以降でCritical CSSがインライン化されていない
  // hooks: {
  //   'build:manifest': (manifest) => {
  //     // https://nuxt.com/docs/3.x/getting-started/styling#lcp-advanced-optimizations
  //     // FIXME: This optimization removes entry CSS from manifest, causing CSS not to load on initial page load
  //     // Need to implement CSS inlining or critical CSS extraction to use this optimization
  //     const css = Object.values(manifest).find(options => options.isEntry === true)?.css;
  //     if (css) {
  //       for (let i = css.length - 1; i >= 0; i--) {
  //         if (css[i]?.startsWith('entry.') === true) {
  //           css.splice(i, 1);
  //         }
  //       }
  //     }
  //   },
  // },
  typescript: {
    // https://github.com/tsconfig/bases?tab=readme-ov-file#strictest-tsconfigjson
    tsConfig: {
      ...tsConfig,
      include: [
        '../histoire/**/*',
      ],
    },
    sharedTsConfig: tsConfig,
    nodeTsConfig: {
      ...tsConfig,
      include: [
        '../content.config.ts',
        '../histoire.config.ts',
        '../lostpixel.config.ts',
        '../vitest.config.ts',
      ],
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
  srcDir: 'app/',
  telemetry: false,
  $production: {
    nitro: {
      preset: 'cloudflare-pages',
      cloudflare: {
        deployConfig: true,
        wrangler: {
          d1_databases: [
            {
              binding: 'DB',
              database_name: 'adzuki-blog-db',
              database_id: process.env.D1_DATABASE_ID,
            },
          ],
        },
      },
    },
  },
});
