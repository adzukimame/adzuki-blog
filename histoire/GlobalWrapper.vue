<template>
  <Html :class="[{ 'dark-mode': colorScheme === 'dark' }, { 'vertical-rl': verticalRl }]" />
  <div class="outer">
    <div class="inner">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Story, Variant } from 'histoire';

defineProps<{
  story: Story;
  variant?: Variant;
}>();

// dark mode
const colorScheme = ref<'light' | 'dark'>((new URLSearchParams(location.search).get('preview-dark-mode') !== null || document.documentElement.classList.contains('htw-dark')) ? 'dark' : 'light');
const classObserver = new MutationObserver((_) => {
  colorScheme.value = (new URLSearchParams(location.search).get('preview-dark-mode') !== null || document.documentElement.classList.contains('htw-dark')) ? 'dark' : 'light';
});
classObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

// writing mode
const verticalRl = ref<boolean>(new URLSearchParams(location.search).get('preview-writing-mode') === 'vertical-rl');
</script>

<style>
/* 日本語対応の明朝体がインストールされていないことがあるのでWebフォントを読み込んでおく */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP&display=swap');
</style>

<style scoped>
.outer {
  color: var(--fg);
  background-color: var(--bg);
  font-family: "Noto Serif JP", "Yu Mincho", "Hiragino Mincho ProN W3", serif;
  font-feature-settings: "pkna" 1;
}

.outer {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
}

.inner {
  inline-size: 100%;
  margin: auto;
  padding: 1rem;
}
</style>
