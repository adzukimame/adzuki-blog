import { defineConfig } from 'histoire';
import { HstVue } from '@histoire/plugin-vue';
import { HstNuxt } from '@histoire/plugin-nuxt';

export default defineConfig({
  setupFile: './histoire/histoire.setup.ts',
  plugins: [
    HstVue(),
    HstNuxt(),
  ],
  vite: {
    plugins: [
      {
        name: 'fix-prose-default-export',
        enforce: 'post',
        generateBundle(_options, bundle) {
          for (const [fileName, chunk] of Object.entries(bundle)) {
            if (fileName.includes('vendor') && chunk.type === 'chunk' && chunk.code) {
              // _default が未定義のまま参照されている箇所をすべて修正
              // Proseコンポーネントのdefaultエクスポートの問題を修正
              chunk.code = chunk.code.replace(
                /const (_default\$[a-z0-9]+) = _default;(\s*const Prose\w+_d_vue)/g,
                'const $1 = {}; // Fixed: _default was undefined$2'
              );
            }
          }
        },
      },
    ],
  },
});
