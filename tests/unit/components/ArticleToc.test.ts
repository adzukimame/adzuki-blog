import { beforeAll, describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ArticleToc from '~/components/content/ArticleToc.vue';

describe('ArticleToc', () => {
  describe('目次が空のとき', () => {
    test('内容がない', async () => {
      expect((await mountSuspended(ArticleToc, { props: { toc: undefined } })).text()).toBe('');
    });

    test('内容がない', async () => {
      expect((await mountSuspended(ArticleToc, { props: { toc: { title: 'a', depth: 1, searchDepth: 1, links: [] } } })).text()).toBe('');
    });
  });

  describe('目次が空でないとき', async () => {
    beforeAll(() => {
      HTMLElement.prototype.animate = () => {};
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
      expect(component.attributes('open')).toBeUndefined();
    });

    // test('クリックすると開く', () => {
    //   component.trigger('toggle', { newState: 'open' });
    //   expect(component.attributes('open')).toBeDefined();
    // });
  });
});
