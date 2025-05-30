import { defineSetupVue3 } from '@histoire/plugin-vue';

import GlobalWrapper from './histoire/GlobalWrapper.vue';

import './assets/css/main.css';

/* eslint-disable */

export const setupVue3 = defineSetupVue3(({ app, story, variant, addWrapper }) => {
  addWrapper(GlobalWrapper);
});

/* eslint-enable */
