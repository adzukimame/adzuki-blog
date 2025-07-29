import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { sleep, mockHTMLElementAnimate, fixComponentCssModules } from '@@/tests/util';
import _ArticleToc from '@/components/content/ArticleToc.vue';

const ArticleToc = fixComponentCssModules(_ArticleToc);

describe('ArticleToc', () => {
  describe('目次が空のとき', () => {
    test('内容がない', async () => {
      expect((await mountSuspended(ArticleToc, { props: { toc: undefined } })).isVisible()).toBe(false);
      expect((await mountSuspended(ArticleToc, { props: { toc: undefined } })).text()).toBe('');
    });

    test('内容がない', async () => {
      expect((await mountSuspended(ArticleToc, { props: { toc: { title: 'a', depth: 1, searchDepth: 1, links: [] } } })).isVisible()).toBe(false);
      expect((await mountSuspended(ArticleToc, { props: { toc: { title: 'a', depth: 1, searchDepth: 1, links: [] } } })).text()).toBe('');
    });
  });

  describe('目次が空でないとき', async () => {
    beforeAll(() => {
      HTMLElement.prototype.animate = mockHTMLElementAnimate;
    });

    const component = await mountSuspended(ArticleToc, { props: { toc: {
      title: 'aTitle',
      depth: 2,
      searchDepth: 2,
      links: [
        { id: 'id1', text: 'text1', depth: 1, children: [{ id: 'id2', text: 'text2', depth: 0 }] },
      ],
    } } });

    test('内容がある', () => {
      expect(component.text()).not.toBe('');
    });

    test('初めは閉じている', () => {
      expect(component.attributes()).not.toHaveProperty('open');
      expect(component.get('nav').isVisible()).toBe(false);
    });

    test('クリックすると開く', async () => {
      component.get('summary').trigger('click');
      await component.vm.$nextTick();
      await sleep(300);
      expect(component.attributes()).toHaveProperty('open');
      expect(component.get('nav').isVisible()).toBe(true);
    });

    test('内容が正しい', () => {
      expect(component.findAll('a')).toHaveLength(2);
      expect(component.findAll('a')[0]?.attributes('href')).toBe('#id1');
      expect(component.findAll('a')[0]?.text()).toBe('text1');
      expect(component.findAll('a')[1]?.attributes('href')).toBe('#id2');
      expect(component.findAll('a')[1]?.text()).toBe('text2');
    });

    test('クリックすると閉じる', async () => {
      component.get('summary').trigger('click');
      await component.vm.$nextTick();
      await sleep(300);
      expect(component.attributes()).not.toHaveProperty('open');
      expect(component.get('nav').isVisible()).toBe(false);
    });
  });
});
