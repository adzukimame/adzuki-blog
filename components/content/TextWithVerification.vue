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
const props = withDefaults(defineProps<{
  name: string;
  fontSizeInRem?: number;
}>(), {
  fontSizeInRem: 1,
});

const colorScheme = useColorScheme();

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
  if (text.value === undefined) {
    error.value = 'rendering';
    return;
  }

  const rootFontSizeInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const fontSize = rootFontSizeInPx * props.fontSizeInRem;

  for (let i = 0; i < text.value.length; i++) {
    const canvas = document.createElement('canvas');
    canvas.style.pointerEvents = 'none';
    canvas.addEventListener('contextmenu', ev => ev.preventDefault());
    canvas.width = fontSize;
    canvas.height = fontSize + 4;
    textBlock.value?.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      error.value = 'rendering';
      return;
    }
    ctx.font = `${fontSize}px "Zen Maru Gothic"`;
    ctx.fillStyle = colorScheme.value === 'light' ? 'black' : 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text.value[i], fontSize / 2, fontSize / 2 + 2);
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
}
</style>
