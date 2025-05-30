export const sleep = (timeout?: number) => {
  return new Promise<void>(r => setTimeout(r, timeout));
};

export const mockHTMLElementAnimate: typeof HTMLElement.prototype.animate = (_keyframes, options) => {
  // durationがstring型のときの処理は適当
  const duration = options === undefined ? 0 : typeof options === 'number' ? options : options.duration === undefined ? 0 : typeof options.duration === 'number' ? options.duration : options.duration instanceof CSSNumericValue ? options.duration.to('ms').value : parseFloat(options.duration);

  const animation = new EventTarget();

  setTimeout(() => {
    animation.dispatchEvent(new Event('finish'));
  }, duration);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- テスト対象のコンポーネント側からは、addEventlistenerが呼べればいいので
  return animation as any;
};
