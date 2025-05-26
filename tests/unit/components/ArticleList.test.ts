import { describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ArticleList from '~/components/ArticleList.vue';

const item = {
  _id: 'anId',
  _path: 'aPath',
  title: 'aTitle',
  description: 'aDescription',
  category: 'aCategory',
  created: '2000-01-01',
  hideDescription: false,
};

describe('ArticleListItem', async () => {
  describe('内容がない場合', async () => {
    test('表示が正しい', async () => {
      expect((await mountSuspended(ArticleList, { props: { articles: null } })).text()).toBe('コンテンツはありません');
      expect((await mountSuspended(ArticleList, { props: { articles: [] } })).text()).toBe('コンテンツはありません');
    });
  });

  describe('内容がある場合', async () => {
    test('ArticleListItemの数が正しい', async () => {
      expect((await mountSuspended(ArticleList, { props: { articles: [item, item, item] } })).findAll('article')).toHaveLength(3);
    });
  });
});
