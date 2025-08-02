<template>
  <div>
    <div :class="$style.headerContainer">
      <AppHeader
        :class="$style.header"
        :use-collapsible-navigation="isNarrow"
        @menu-opened="menuOpened = true"
        @menu-closed="menuOpened = false" />
    </div>
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

const writingMode = useWritingMode();

const isNarrow = ref(false);
const NARROW_THRESHOLD = 768;

onMounted(() => {
  isNarrow.value = writingMode.value === 'vertical-rl' ? window.innerHeight <= NARROW_THRESHOLD : window.innerWidth <= NARROW_THRESHOLD;

  window.addEventListener('resize', () => {
    isNarrow.value = writingMode.value === 'vertical-rl' ? window.innerHeight <= NARROW_THRESHOLD : window.innerWidth <= NARROW_THRESHOLD;
    if (!isNarrow.value) {
      menuOpened.value = false;
    }
  });
});
</script>

<style module>
@value horizontalSmall, verticalSmall from "~/assets/css/breakpoints.module.css";

.headerContainer {
  position: sticky;
  inset-block-start: 0;
  z-index: 2;
  block-size: var(--header-bsize);
  border-block-end: solid var(--split) 2px;
  background-color: var(--bg);
  color: var(--fg-strong);
  transition: background-color var(--color-scheme-trans-dur);
}

.header {
  max-inline-size: calc(768px - 24px * 2);
  margin-inline: auto;

  :root:not(:global(.vertical-rl)) & {
    @media horizontalSmall {
      inline-size: 100%;
      padding-inline: 24px;
      margin-inline: 0;
    }
  }

  :root:global(.vertical-rl) & {
    @media verticalSmall {
      inline-size: 100%;
      padding-inline: 24px;
      margin-inline: 0;
    }
  }
}

.slotContainer {
  max-inline-size: 768px;
  padding-block: 32px;
  padding-inline: 24px;
  margin-block: 0;
  margin-inline: auto;
  /* フッターが上／右に上がってこないようにする */
  min-block-size: calc(100svb - var(--header-bsize) - var(--footer-bsize));
  transition: opacity var(--page-trans-dur) var(--page-trans-func), filter var(--page-trans-dur) var(--page-trans-func);

  :root:not(:global(.vertical-rl)) & {
    @media horizontalSmall {
      inline-size: 100%;
      margin-inline: 0;
    }
  }

  :root:global(.vertical-rl) & {
    @media verticalSmall {
      inline-size: 100%;
      margin-inline: 0;
    }
  }
}

.menuOpened {
  opacity: 0;
  filter: blur(4px);
}
</style>
