import { describe, expect, test } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import TextWithVerification from '~/components/content/TextWithVerification.vue';

describe('TextWithVerification', () => {
  test('初めはプレースホルダのテキストが表示される', async () => {
    const component = await mountSuspended(TextWithVerification, { props: {
      name: 'test',
    } });
    expect(component.text()).toBe('アクセスの検証が完了すると、ここに内容が表示されます。');
  });

  // TODO
  // test('検証に失敗するとエラーメッセージが表示される', async () => {
  //   const component = await mountSuspended(TextWithVerification, { props: {
  //     name: 'test',
  //   } });
  // });
});
