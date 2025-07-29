import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { sleep, mockHTMLElementAnimate, fixComponentCssModules } from '@@/tests/util';
import _ImageViewer from '@/components/content/ImageViewer.vue';

const ImageViewer = fixComponentCssModules(_ImageViewer);

describe('ImageViewer', async () => {
  beforeAll(() => {
    HTMLElement.prototype.animate = mockHTMLElementAnimate;
  });

  const component = await mountSuspended(ImageViewer, { props: {
    src: 'http://localhost:3000/apple-touch-icon.png',
    alt: 'an alt text',
  } });

  describe('通常の画像の', () => {
    test('src属性が正しい', () => {
      expect(component.get('img').attributes('src')).toBe('http://localhost:3000/apple-touch-icon.png');
    });

    test('alt属性が正しい', () => {
      expect(component.get('img').attributes('alt')).toBe('an alt text');
    });
  });

  test('画像をクリックする前はモーダルが表示されていない', () => {
    expect(document.body.querySelector('[data-testid="modal-container"]')).toBe(null);
  });

  test('画像をクリックするとモーダルが開く', async () => {
    component.get('[data-testid="image"]').trigger('click');
    await component.vm.$nextTick();
    await sleep(300);
    expect(document.body.querySelector('[data-testid="modal-container"]')).not.toBe(null);
  });

  describe('モーダルの画像の', () => {
    test('src属性が正しい', () => {
      expect(document.body.querySelector('[data-testid="modal-container"] img')?.getAttribute('src')).toBe('http://localhost:3000/apple-touch-icon.png');
    });

    test('alt属性が正しい', () => {
      expect(document.body.querySelector('[data-testid="modal-container"] img')?.getAttribute('alt')).toBe('an alt text');
    });
  });

  test('モーダルをクリックするとモーダルが閉じる', async () => {
    document.body.querySelector('[data-testid="modal-container"]')?.dispatchEvent(new MouseEvent('click'));
    await component.vm.$nextTick();
    await sleep(300);
    expect(document.body.querySelector('[data-testid="modal-container"]')).toBe(null);
  });
});
