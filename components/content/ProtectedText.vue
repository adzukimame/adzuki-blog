<template>
  <ClientOnly>
    <div ref="textBlock">
      <!--  -->
    </div>
    <template #fallback />
  </ClientOnly>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();

const textBlock = useTemplateRef('textBlock');

const renderCanvas = (text: string) => {
  if (textBlock === null) {
    return;
  }

  for (let i = 0; i < text.length; i++) {
    const canvas = document.createElement('canvas');
    canvas.style.pointerEvents = 'none';
    canvas.addEventListener('contextmenu', ev => ev.preventDefault());
    canvas.width = 24;
    canvas.height = 28;
    textBlock.value?.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (ctx === null) {
      return;
    }
    ctx.font = '24px sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text[i], 12, 14);
  }
};

if (import.meta.client) {
  $fetch.raw('/api/get-protected-text', {
    query: {
      name: props.name,
    },
    watch: [() => props.name],
  }).then((response) => {
    const header = response.headers.get('X-Attached-Payload');
    if (header === null) {
      return;
    }
    const rand = Uint8Array.from(atob(header), char => char.codePointAt(0)!);

    const data = response._data;
    if (data == null) {
      return;
    }

    data.arrayBuffer().then(buffer => {
      const byteArray = new Uint8Array(buffer);
      const text = new TextDecoder().decode(byteArray.map((byte, idx) => byte ^ rand[idx]));
      renderCanvas(text);
    });
  });
}
</script>

<style module>
.container {
  display: block grid;
  grid-template-rows: 2rem 1.6rem 1.6rem;
  padding-inline-start: 1rem;
  background-color: var(--bgStrong);
  border: solid 1px var(--split);
  border-radius: 6px;
  line-height: 2;
  transition: background-color var(--colorSchemeTransitionDuration);
}

.title {
  display: block;
  font-size: 1rem;
  color: var(--fg);
  overflow: clip;
  transition: text-decoration var(--hoverTransitionDuration) var(--hoverTransitionFunction);
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

.title:not(.loaded) {
  cursor: default;
}

@media (hover: hover) {
  .container:hover>.title.loaded {
    color: var(--fgStrong);
    text-decoration: underline;
  }
}

@media (hover: none) {
  .container:active>.title.loaded {
    color: var(--fgStrong);
    text-decoration: underline;
  }
}

.description {
  display: block;
  font-size: 0.8rem;
  color: var(--fgWeak);
  overflow: clip;
}

.faviconAndHostnameContainer {
  display: block flex;
  font-size: 0.8rem;
  align-items: center;
}

.favicon {
  display: block;
  inline-size: 0.8rem;
  block-size: 0.8rem;
  object-fit: contain;
}

.hostname {
  color: var(--fg);
  overflow: clip;
  padding-inline-start: 0.5rem;
}
</style>
