import { defineConfig } from 'histoire';
import { HstVue } from '@histoire/plugin-vue';
import { HstNuxt } from '@histoire/plugin-nuxt';

export default defineConfig({
  setupFile: './histoire.setup.ts',
  plugins: [
    HstVue(),
    HstNuxt(),
  ],
  vite: {
    plugins: [
      {
        name: 'inject-stylesheet',
        transformIndexHtml: {
          order: 'post',
          handler(_html, _ctx) {
            return [
              {
                tag: 'link',
                attrs: {
                  rel: 'stylesheet',
                  type: 'text/css',
                  href: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@350;600&family=Zen+Maru+Gothic:wght@400;700&display=swap',
                },
                injectTo: 'head',
              },
            ];
          },
        },
      },
    ],
  },
});
