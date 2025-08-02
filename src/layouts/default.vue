<template>
  <div>
    <AppHeader
      @menu-opened="menuOpened = true"
      @menu-closed="menuOpened = false" />
    <div
      :class="[$style.slotContainer, { [$style.menuOpened]: menuOpened }]"
      :inert="menuOpened ? true : undefined"
      :aria-hidden="menuOpened ? true : undefined"
      data-testid="slot-container">
      <slot />
    </div>
    <AppFooter
      :class="{ [$style.menuOpened]: menuOpened }"
      :inert="menuOpened ? true : undefined"
      :aria-hidden="menuOpened ? true : undefined" />
  </div>
</template>

<script setup lang="ts">
const menuOpened = ref(false);
</script>

<style module>
.slotContainer {
  max-inline-size: 768px;
  padding-block: 32px;
  padding-inline: 24px;
  margin-block: 0;
  margin-inline: auto;
  /* フッターが上／右に上がってこないようにする */
  min-block-size: calc(100svb - var(--header-bsize) - var(--footer-bsize));
  transition: opacity var(--page-trans-dur) var(--page-trans-func), filter var(--page-trans-dur) var(--page-trans-func);
}

@media (max-width: 768px) {
  .slotContainer {
    inline-size: 100%;
    padding: 24px;
    margin-inline: 0;
  }
}

:root:global(.vertical-rl) .slotContainer {
  inline-size: 100%;
  padding-inline: 32px;
  margin-inline: 0;
}

.menuOpened {
  opacity: 0;
  filter: blur(4px);
}
</style>
