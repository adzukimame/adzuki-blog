// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/eslint'],
  runtimeConfig: {
    public: {
      cfWebAnalyticsToken: '',
    },
    summalyProxyUrl: '',
    imgAndMediaSrc: [''],
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
  css: [
    '~/assets/css/main.css',
  ],
  content: {
    markdown: {
      anchorLinks: false,
      toc: {
        depth: 2,
        searchDepth: 2,
      },
      remarkPlugins: {
        'remark-breaks': {},
      },
      tags: {
        img: 'ImageViewer',
      },
    },
  },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { href: 'https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@400;700&display=swap', rel: 'stylesheet' },
      ],
    },
  },
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  $production: {
    nitro: {
      preset: 'cloudflare-pages',
    },
  },
});
