import './assets/css/main.css';
import { defineSetupVue3 } from '@histoire/plugin-vue';
import GlobalWrapper from './histoire/GlobalWrapper.vue';

/* eslint-disable */

export const setupVue3 = defineSetupVue3(({ app, story, variant, addWrapper }) => {
  addWrapper(GlobalWrapper);
});

/* eslint-enable */
