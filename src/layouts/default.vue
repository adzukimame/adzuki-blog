<template>
  <div>
    <AppHeader
      @menu-opened="menuOpened = true"
      @menu-closed="menuOpened = false" />
    <div
      class="slot-container"
      :class="{ menuOpened }"
      :inert="menuOpened ? true : undefined"
      :aria-hidden="menuOpened ? true : undefined"
      data-testid="slot-container">
      <slot />
    </div>
    <AppFooter
      :class="{ menuOpened }"
      :inert="menuOpened ? true : undefined"
      :aria-hidden="menuOpened ? true : undefined" />
  </div>
</template>

<script setup lang="ts">
const menuOpened = ref(false);
</script>

<style scoped>
.slot-container {
  max-inline-size: 768px;
  padding-block: 32px;
  padding-inline: 24px;
  margin-block: 0;
  margin-inline: auto;
  /* フッターが上／右に上がってこないようにする */
  min-block-size: calc(100svb - var(--headerHeight) - var(--footerHeight));
  transition: opacity var(--pageTransitionDuration) var(--pageTransitionFunction), filter var(--pageTransitionDuration) var(--pageTransitionFunction);
}

@media (max-width: 768px) {
  .slot-container {
    inline-size: 100%;
    padding: 24px;
    margin-inline: 0;
  }
}

:root.writing-mode-vertical-rl .slot-container {
  inline-size: 100%;
  padding-inline: 32px;
  margin-inline: 0;
}

.menuOpened {
  opacity: 0;
  filter: blur(4px);
}
</style>
