<template>
  <ClientOnly>
    <NuxtTurnstile
      :class="$style.turnstileWidget"
      :options="{
        'appearance': 'always',
        'callback': turnstileCallback,
        'error-callback': turnstileErrorCallback,
      }" />
    <div v-if="error !== false">
      {{ error === 'verification' ? '検証に失敗したため' : error === 'rendering' ? '描画に失敗したため' : 'エラーが発生したため' }}、表示できません。
    </div>
    <div
      v-else
      ref="textBlock"
      :class="$style.textBlock">
      <span v-if="loading">アクセスの検証が完了すると、ここに内容が表示されます。</span>
      <canvas
        v-for="idx in textLength"
        :key="idx"
        :ref="(el) => canvasRefFunc(el, idx - 1)"
        width="0"
        height="0" />
    </div>
    <template #fallback>
      <div :class="$style.placeholder" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();

const writingMode = useWritingMode();

const loading = ref(true);
const error = ref<boolean | 'verification' | 'rendering'>(false);
const textLength = ref<number>(0);
const canvasRefs = ref<(HTMLCanvasElement | null)[]>([]);

const canvasRefFunc = (element: Element | globalThis.ComponentPublicInstance | null, index: number) => {
  if (element instanceof HTMLCanvasElement) {
    canvasRefs.value[index] = element;
  }
};

let measureCanvas: HTMLCanvasElement | undefined = undefined;
let measureCtx: CanvasRenderingContext2D | null = null;

const renderOneCanvas = (canvas: HTMLCanvasElement, char: string) => {
  const canvasFont = '16px / 32px "Yu Mincho", "Hiragino Mincho ProN W3", serif';

  const bodyComputedStyle = getComputedStyle(document.body);
  const fontSize = parseFloat(bodyComputedStyle.fontSize);
  const lineHeight = parseFloat(bodyComputedStyle.lineHeight);

  measureCanvas ??= document.createElement('canvas');
  measureCtx ??= measureCanvas.getContext('2d');
  if (measureCtx) measureCtx.font = canvasFont;

  const realWidth = Math.ceil(measureCtx?.measureText(char).width ?? fontSize);

  canvas.width = writingMode.value === 'horizontal-tb' ? realWidth : lineHeight;
  canvas.height = writingMode.value === 'horizontal-tb' ? lineHeight : fontSize;
  canvas.style.pointerEvents = 'none';
  canvas.addEventListener('contextmenu', ev => ev.preventDefault());
  canvas.style.writingMode = 'horizontal-tb';

  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    error.value = 'rendering';
    return;
  }
  ctx.font = canvasFont;
  ctx.fillStyle = bodyComputedStyle.color;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(char, (writingMode.value === 'horizontal-tb' ? realWidth : lineHeight) / 2, (writingMode.value === 'horizontal-tb' ? lineHeight : fontSize) / 2);
};

const turnstileCallback = (token: string) => {
  $fetch.raw('/api/text-with-verification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: props.name,
      token,
    }),
    watch: [() => props.name],
  }).then(async (response): Promise<[ArrayBuffer, Uint8Array]> => {
    const header = response.headers.get('X-Attached-Payload');
    if (header === null) {
      throw new Error();
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Stringのイテレータから得られる各文字は長さ1以上のはず
    const rand = Uint8Array.from(atob(header), char => char.codePointAt(0)!);

    const data = response._data;
    if (!(data instanceof Blob)) {
      throw new Error();
    }

    if (data.size !== rand.byteLength) {
      throw new Error();
    }

    textLength.value = data.size;

    return [await data.arrayBuffer(), rand];
  }).then(async ([buffer, rand]) => {
    const byteArray = new Uint8Array(buffer);

    loading.value = false;

    await nextTick();

    let i = 0;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- byteArrayの元のBlobのバイト数とrandのバイト数が等しいことは上で確認済み
    for (const char of new TextDecoder().decode(byteArray.map((byte, idx) => byte ^ rand[idx]!))) {
      const c = canvasRefs.value[i];
      if (c) renderOneCanvas(c, char);
      i++;
    }
  }).catch(() => {
    loading.value = false;
    error.value = true;
  });
};

const turnstileErrorCallback = () => {
  loading.value = false;
  error.value = 'verification';
};
</script>

<style module>
.turnstileWidget {
  width: 300px;
  height: 75px;
}

.placeholder {
  width: 300px;
  height: 75px;
  margin-block-end: calc(2rem + 1.8rem);
}

.textBlock {
  min-block-size: 2rem;
  display: flex;
  flex-wrap: wrap;
}
</style>
