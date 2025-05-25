import { describe, expect, test } from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import AppFooter from '~/components/AppFooter.vue';

const runtimeConfig = { public: { authorName: crypto.randomUUID() } };

mockNuxtImport('useRuntimeConfig', () => {
  return () => {
    return runtimeConfig;
  };
});

describe('AppFooter', async () => {
  const component = await mountSuspended(AppFooter);

  test('著作権表示がなされる', async () => {
    expect(component.text()).toBe(`Copyright © ${new Date().getFullYear()} ${runtimeConfig.public.authorName}. All Rights Reserved.`);
  });
});
