import { resolve } from 'node:path';
import AutoImportFunctions from 'unplugin-auto-import/vite';
import AutoImportComponents from 'unplugin-vue-components/vite';
import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  viteFinal: async (config) => {
    if (config?.resolve?.alias) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '~': resolve(__dirname, '../'),
      };
    }

    if (config?.plugins) {
      config.plugins.push(
        AutoImportFunctions({
          imports: [
            'vue',
            'vue-router',
          ],
          dts: '.storybook/auto-imports.d.ts',
        })
      );

      config.plugins.push(
        AutoImportComponents({
          dirs: ['components'],
          dts: '.storybook/components.d.ts',
        })
      );
    }

    return config;
  },
};

export default config;
