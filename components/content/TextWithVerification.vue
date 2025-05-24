<template>
  <ClientOnly>
    <NuxtTurnstile v-model="token" />
    <div v-if="loading">
      Loading...
    </div>
    <div v-else-if="error">
      An error occured while loading.
    </div>
    <div v-else
         ref="textBlock" />
    <template #fallback />
  </ClientOnly>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string;
  fontSizeInRem?: number;
}>(), {
  fontSizeInRem: 1,
});

const loading = ref(true);
const error = ref(false);
const textBlock = useTemplateRef('textBlock');
const text = ref<string | undefined>(undefined);
const token = ref();

const renderCanvas = () => {
  if (text.value === undefined) {
    error.value = true;
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
      error.value = true;
      return;
    }
    ctx.font = `${fontSize}px "Zen Maru Gothic"`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text.value[i], fontSize / 2, fontSize / 2 + 2);
  }
};

if (import.meta.client) {
  $fetch.raw('/api/text-with-verification', {
    method: 'POST',
    body: {
      name: props.name,
      token: token.value,
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

  watch([text, textBlock], ([newText, newTextBlock]) => {
    if (newText !== undefined && newTextBlock !== null) {
      renderCanvas();
    }
  });
}
</script>
