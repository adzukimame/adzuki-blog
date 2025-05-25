import { describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ArticleListItem from '~/components/ArticleListItem.vue';

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
  const component = await mountSuspended(ArticleListItem, { props: { item } });

  test('リンク先の表示が正しい', () => {
    expect(component.get('[data-testid="link"]').attributes('href')).toBe('/aPath');
  });

  test('タイトルの表示が正しい', () => {
    expect(component.get('[data-testid="title"]').text()).toBe('aTitle');
  });

  test('詳細の表示が正しい', () => {
    expect(component.get('[data-testid="description"]').text()).toBe('aDescription');
  });

  test('hideDescriptionなら詳細が表示されない', async () => {
    expect((await mountSuspended(ArticleListItem, { props: {
      item: {
        ...item,
        hideDescription: true,
      },
    } })).get('[data-testid="description"]').text()).toBe('…');
  });

  test('カテゴリの表示が正しい', () => {
    expect(component.get('[data-testid="category"]').text()).toBe('aCategory');
  });

  test('カテゴリのリンク先が正しい', () => {
    expect(component.get('[data-testid="category"]').get('a').attributes('href')).toBe('/category/aCategory');
  });

  describe('カテゴリ未設定の場合', async () => {
    const component = await mountSuspended(ArticleListItem, { props: {
      item: {
        ...item,
        category: undefined,
      },
    } });

    test('カテゴリの表示が正しい', () => {
      expect(component.get('[data-testid="category"]').text()).toBe('未設定');
    });

    test('カテゴリのリンク先が正しい', () => {
      expect(component.get('[data-testid="category"]').get('a').attributes('href')).toBe('/category/undefined');
    });
  });

  describe('カテゴリが複数指定されている場合', async () => {
    const component = await mountSuspended(ArticleListItem, { props: {
      item: {
        ...item,
        category: ['aCategory1', 'aCategory2'],
      },
    } });

    test('カテゴリの表示が正しい', () => {
      expect(component.get('[data-testid="category"]').findAll('a')).toHaveLength(2);
      expect(component.get('[data-testid="category"]').findAll('a')[0].text()).toBe('aCategory1');
      expect(component.get('[data-testid="category"]').findAll('a')[1].text()).toBe('aCategory2');
    });

    test('カテゴリのリンク先が正しい', () => {
      expect(component.get('[data-testid="category"]').findAll('a')[0].attributes('href')).toBe('/category/aCategory1');
      expect(component.get('[data-testid="category"]').findAll('a')[1].attributes('href')).toBe('/category/aCategory2');
    });
  });

  test('日時の表示が正しい', () => {
    expect(component.get('[data-testid="created"]').text()).toBe('2000年1月1日');
  });

  test('日時が未設定の場合の表示が正しい', async () => {
    expect((await mountSuspended(ArticleListItem, { props: {
      item: {
        ...item,
        created: undefined,
      },
    } })).get('[data-testid="created"]').text()).toBe('不明');
  });
});
