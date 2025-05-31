import { defineSetupVue3 } from '@histoire/plugin-vue';

import GlobalWrapper from './GlobalWrapper.vue';

import '@@/src/assets/css/main.css';

export const setupVue3 = defineSetupVue3((api) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- ドキュメント通りに書いていてもエラーになる (https://histoire.dev/guide/vue3/wrapper.html)
  api.addWrapper(GlobalWrapper);
});
