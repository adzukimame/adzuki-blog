<template>
  <ClientOnly>
    <NuxtTurnstile :class="$style.turnstileWidget"
                   :options="{
                     'appearance': 'always',
                     'callback': turnstileCallback,
                     'error-callback': turnstileErrorCallback,
                   }" />
    <div v-if="loading">
      アクセスの検証が完了すると、ここに内容が表示されます。
    </div>
    <div v-else-if="error !== false">
      {{ error === 'verification' ? '検証に失敗したため' : error === 'rendering' ? '描画に失敗したため' : 'エラーが発生したため' }}、表示できません。
    </div>
    <div v-else
         ref="textBlock"
         :class="$style.textBlock" />
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
const textBlock = useTemplateRef('textBlock');
const text = ref<string>();

const turnstileCallback = (token: string) => {
  $fetch.raw('/api/text-with-verification', {
    method: 'POST',
    body: {
      name: props.name,
      token,
    },
    watch: [() => props.name],
  }).then((response) => {
    loading.value = false;

    const header = response.headers.get('X-Attached-Payload');
    if (header === null) {
      error.value = true;
      return;
    }
    const rand = Uint8Array.from(atob(header), char => char.codePointAt(0)!);

    const data = response._data;
    if (!(data instanceof Blob)) {
      error.value = true;
      return;
    }

    data.arrayBuffer().then((buffer) => {
      const byteArray = new Uint8Array(buffer);
      text.value = new TextDecoder().decode(byteArray.map((byte, idx) => byte ^ rand[idx]));
    });
  }).catch(() => {
    error.value = true;
    loading.value = false;
  });
};

const turnstileErrorCallback = () => {
  error.value = 'verification';
  loading.value = false;
};

const renderCanvas = () => {
  if (text.value === undefined || textBlock.value === null) {
    error.value = 'rendering';
    return;
  }

  const textBlockComputedStyle = getComputedStyle(textBlock.value);
  const fontSize = parseFloat(textBlockComputedStyle.fontSize);
  const lineHeight = parseFloat(textBlockComputedStyle.lineHeight);

  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d');
  if (measureCtx) measureCtx.font = textBlockComputedStyle.font;

  for (let i = 0; i < text.value.length; i++) {
    const realWidth = Math.ceil(measureCtx?.measureText(text.value[i])?.width ?? fontSize);

    const canvas = document.createElement('canvas');
    canvas.width = writingMode.value === null ? realWidth : lineHeight;
    canvas.height = writingMode.value === null ? lineHeight : fontSize;
    canvas.style.pointerEvents = 'none';
    canvas.addEventListener('contextmenu', ev => ev.preventDefault());
    canvas.style.writingMode = 'horizontal-tb';

    textBlock.value.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      error.value = 'rendering';
      return;
    }
    ctx.font = textBlockComputedStyle.font;
    ctx.fillStyle = textBlockComputedStyle.color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text.value[i], (writingMode.value === null ? realWidth : lineHeight) / 2, (writingMode.value === null ? lineHeight : fontSize) / 2);
  }
};

watch([text, textBlock], ([newText, newTextBlock]) => {
  if (newText !== undefined && newTextBlock !== null) {
    renderCanvas();
  }
});
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
