<template>
  <Html :class="{ 'color-scheme-dark': colorScheme === 'dark' }" />
  <div class="outer">
    <div class="inner">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const colorScheme = ref<'light' | 'dark'>(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
  colorScheme.value = event.matches ? 'light' : 'dark';
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@350;600&family=Zen+Maru+Gothic:wght@400;700&display=swap');
</style>

<style scoped>
.outer {
  color: var(--fg);
  background-color: var(--bg);
  font-family: "Fredoka", "Zen Maru Gothic", "Arial", "Helvetica", "Yu Gothic", sans-serif;
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
