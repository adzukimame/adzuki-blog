export const sleep = (timeout?: number) => {
  return new Promise<void>(r => setTimeout(r, timeout));
};

export const mockHTMLElementAnimate: typeof HTMLElement.prototype.animate = (_keyframes, options): Animation => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- テストが動けばよいので
  const duration = options === undefined ? 0 : typeof options === 'number' ? options : options.duration === undefined ? 0 : typeof options.duration === 'number' ? options.duration : (options.duration as unknown as any).to('ms').value as number;

  const animation = new EventTarget();

  setTimeout(() => {
    animation.dispatchEvent(new Event('finish'));
  }, duration);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- テスト対象のコンポーネント側からはaddEventlistenerさえ呼べればそれでよいので
  return animation as any;
};
