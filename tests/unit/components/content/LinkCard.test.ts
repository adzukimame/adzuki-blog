import { describe, expect, test } from 'vitest';
import { mountSuspended, registerEndpoint, mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { SummalyResult } from '@misskey-dev/summaly/built/summary';
import { fixComponentCssModules } from '@@/tests/util';
import _LinkCard from '~/components/content/LinkCard.vue';

const LinkCard = fixComponentCssModules(_LinkCard);

mockNuxtImport('useRuntimeConfig', () => {
  return () => {
    return { public: { origin: 'http://localhost:3000' } };
  };
});

registerEndpoint('/api/url-preview', async (event) => {
  const requestUrl = new URL(event.node.req.originalUrl!, 'http://localhost:3000');
  if (decodeURIComponent(requestUrl.searchParams.get('url')!) === 'http://localhost:3001/linked-page') {
    return {
      title: 'a title',
      icon: 'http://localhost:3001/apple-touch-icon.png',
      description: 'a description',
      sitename: 'a site name',
      url: 'http://localhost:3001/linked-page',
      thumbnail: null,
      activityPub: null,
      fediverseCreator: null,
      player: {
        url: null,
        width: null,
        height: null,
        allow: [],
      },
    } satisfies SummalyResult;
  }
  else {
    return createError('error');
  }
});

// TODO: ロジックを分離してきちんとテストできるようにする
describe('LinkCard', async () => {
  const component = await mountSuspended(LinkCard, { props: {
    url: 'http://localhost:3001/linked-page',
  } });

  test('リンク先が正しい', () => {
    expect(component.get('a').attributes('href')).toBe('http://localhost:3001/linked-page');
  });

  /* describe('プレビュー情報の取得が成功したとき', async () => {
    const component = await mountSuspended(LinkCard, { props: {
      url: 'http://localhost:3001/linked-page',
    } });

    test('リンク先が正しい', () => {
      expect(component.get('a').attributes('href')).toBe('http://localhost:3001/linked-page');
    });

    test('ページタイトルが表示される', () => {
      expect(component.get('[data-testid="title"]').text()).toBe('a title');
    });

    test('説明が表示される', () => {
      expect(component.get('[data-testid="description"]').text()).toBe('a description');
    });

    test('アイコンが表示される', () => {
      expect(component.get('img').attributes('src')).toBe('http://localhost:3001/apple-touch-icon.png');
    });

    test('ホスト名が表示される', () => {
      expect(component.get('[data-testid="hostname"]').text()).toBe('localhost');
    });
  }); */

  /* describe('プレビュー情報の取得が失敗したとき', async () => {
    const component = await mountSuspended(LinkCard, { props: {
      url: 'http://example.com/error',
    } });

    test('リンク先が正しい', () => {
      expect(component.get('a').attributes('href')).toBe('http://example.com/error');
    });

    test('ページタイトルが表示される', () => {
      expect(component.get('[data-testid="title"]').text()).toBe('http://example.com/error');
    });

    test('説明が表示される', () => {
      expect(component.get('[data-testid="description"]').text()).toBe('説明はありません');
    });

    test('アイコンが表示されない', () => {
      expect(component.findAll('[data-testid="favicon"]')).toHaveLength(0);
    });

    test('ホスト名が表示される', () => {
      expect(component.get('[data-testid="hostname"]').text()).toBe('example.com');
    });
  }); */
});
