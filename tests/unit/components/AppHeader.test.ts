import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime';
import AppHeader from '~/components/AppHeader.vue';

mockNuxtImport('useRuntimeConfig', () => {
  return () => {
    return { public: { siteName: 'a site name' } };
  };
});

describe('AppHeader', () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    HTMLElement.prototype.animate = (..._) => undefined as unknown as any;
  });

  describe('ウィンドウ幅が広いとき', async () => {
    const component = await mountSuspended(AppHeader);

    test('サイト名が正しい', () => {
      expect(component.get('[data-testid="site-name"]').text()).toBe('a site name');
      expect(component.get('[data-testid="site-name"]').get('a').attributes('href')).toBe('/');
    });

    test('ナビゲーションが表示されている', () => {
      expect(component.get('nav').isVisible()).toBe(true);
    });

    test('ナビゲーションの内容が正しい', () => {
      expect(component.get('nav').findAll('a')).toHaveLength(2);
      expect(component.get('nav').findAll('a')[0].text()).toBe('カテゴリ一覧');
      expect(component.get('nav').findAll('a')[0].attributes('href')).toBe('/category');
      expect(component.get('nav').findAll('a')[1].text()).toBe('About');
      expect(component.get('nav').findAll('a')[1].attributes('href')).toBe('/pages/about');
    });

    test('ダークモード切り替えボタンが表示されている', () => {
      expect(component.get('[data-testid="color-switch"]').isVisible()).toBe(true);
    });
  });

  describe('ウィンドウ幅が狭いとき', async () => {
    window.innerWidth = 500;

    const component = await mountSuspended(AppHeader);

    test('サイト名が正しい', () => {
      expect(component.get('[data-testid="site-name"]').text()).toBe('a site name');
      expect(component.get('[data-testid="site-name"]').get('a').attributes('href')).toBe('/');
    });

    test('ナビゲーションが表示されない', async () => {
      expect(component.findAll('nav')).toHaveLength(0);
    });

    test('ダークモード切り替えボタンが表示されている', () => {
      expect(component.get('[data-testid="color-switch"]').isVisible()).toBe(true);
    });

    test('メニュー表示ボタンを押すとナビゲーションが表示される', async () => {
      expect(component.emitted('menuOpened')).toBeUndefined();

      component.get('[data-testid="menu-button"]').trigger('click');
      await component.vm.$nextTick();

      expect(component.emitted('menuOpened')).toHaveLength(1);
      expect(component.get('nav')).toBeDefined();
    });

    // FIXME
    // test('もう一度メニュー表示ボタンを押すとメニューが閉じる', async () => {
    //   expect(component.emitted('menuClosed')).toBeUndefined();

    //   component.get('[data-testid="menu-button"]').trigger('click');
    //   await component.vm.$nextTick();

    //   expect(component.emitted('menuClosed')).toHaveLength(1);
    //   expect(component.findAll('nav')).toHaveLength(0);
    // });
  });
});
