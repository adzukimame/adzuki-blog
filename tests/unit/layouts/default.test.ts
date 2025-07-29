import { describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { fixComponentCssModules } from '@@/tests/util';
import _LayoutDefault from '~/layouts/default.vue';

const LayoutDefault = fixComponentCssModules(_LayoutDefault);

describe('Layout Default', async () => {
  const component = await mountSuspended(LayoutDefault);

  test('初めはslotのラッパーとフッターが無効になっていない', async () => {
    expect(component.get('[data-testid="slot-container"]').attributes('inert')).toBeUndefined();
    expect(component.get('[data-testid="slot-container"]').attributes('aria-hidden')).toBeUndefined();
    expect(component.get('footer').attributes('inert')).toBeUndefined();
    expect(component.get('footer').attributes('aria-hidden')).toBeUndefined();
  });

  test('メニューが開くとslotのラッパーとフッターが無効になる', async () => {
    component.getComponent({ name: 'AppHeader' }).vm.$emit('menuOpened');
    await component.vm.$nextTick();
    expect(component.get('[data-testid="slot-container"]').attributes('inert')).toBeDefined();
    expect(component.get('[data-testid="slot-container"]').attributes('aria-hidden')).toBe('true');
    expect(component.get('footer').attributes('inert')).toBeDefined();
    expect(component.get('footer').attributes('aria-hidden')).toBe('true');
  });

  test('メニューが閉じると元に戻る', async () => {
    component.getComponent({ name: 'AppHeader' }).vm.$emit('menuClosed');
    await component.vm.$nextTick();
    expect(component.get('[data-testid="slot-container"]').attributes('inert')).toBeUndefined();
    expect(component.get('[data-testid="slot-container"]').attributes('aria-hidden')).toBeUndefined();
    expect(component.get('footer').attributes('inert')).toBeUndefined();
    expect(component.get('footer').attributes('aria-hidden')).toBeUndefined();
  });
});
