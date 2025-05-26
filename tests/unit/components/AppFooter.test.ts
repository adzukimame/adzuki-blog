import { describe, expect, test } from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import AppFooter from '~/components/AppFooter.vue';

mockNuxtImport('useRuntimeConfig', () => {
  return () => {
    return { public: { authorName: 'an author name' } };
  };
});

describe('AppFooter', async () => {
  const component = await mountSuspended(AppFooter);

  test('著作権情報が表示される', async () => {
    expect(component.text()).toBe(`Copyright © ${new Date().getFullYear()} an author name. All Rights Reserved.`);
  });
});
