<template>
  <div>
    <div :class="[$style.headerContainer, { [$style.headerHidden]: !headerVisible }]">
      <AppHeader
        :class="$style.header"
        :use-collapsible-navigation="isNarrow"
        @menu-opened="menuOpened = true"
        @menu-closed="menuOpened = false" />
    </div>
    <LoadingIndicator />
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
const NARROW_THRESHOLD = 816;

const scrollDirection = useScrollDirection();
const headerVisible = ref(true);

watch(scrollDirection, (direction) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  headerVisible.value = direction !== 'down';
});

onMounted(() => {
  isNarrow.value = writingMode.value === 'vertical-rl' ? window.innerHeight <= NARROW_THRESHOLD : window.innerWidth <= NARROW_THRESHOLD;

  window.addEventListener('resize', () => {
    isNarrow.value = writingMode.value === 'vertical-rl' ? window.innerHeight <= NARROW_THRESHOLD : window.innerWidth <= NARROW_THRESHOLD;
    if (!isNarrow.value) {
      menuOpened.value = false;
    }
  });

  window.addEventListener('scroll', updateScrollDirection, { passive: true });
});
</script>

<style module>
@value narrowWidth, shortHeight from "~/assets/css/breakpoints.module.css";

.headerContainer {
  position: sticky;
  z-index: 2;
  block-size: var(--header-bsize);
  border-block-end: solid var(--split) 2px;
  background-color: var(--bg);
  color: var(--fg-strong);
  transition: background-color var(--color-scheme-trans-dur), transform 250ms ease-in-out;

  /* vertical-rlだとなぜかinset-block-startが効かない */
  :root:where([data-writing-mode="vertical-rl"]) & {
    right: 0;
  }

  :root:where([data-writing-mode="horizontal-tb"], :not([data-writing-mode])) & {
    inset-block-start: 0;
  }

  &.headerHidden {
    :root:where([data-writing-mode="horizontal-tb"], :not([data-writing-mode])) & {
      transform: translateY(-100%);
    }

    :root:where([data-writing-mode="vertical-rl"]) & {
      transform: translateX(100%);
    }
  }
}

.header {
  max-inline-size: 768px;
  margin-inline: auto;

  :root:where([data-writing-mode="horizontal-tb"], :not([data-writing-mode])) & {
    @media narrowWidth {
      inline-size: calc(100% - 24px * 2);
      margin-inline: 24px;
    }
  }

  :root:where([data-writing-mode="vertical-rl"]) & {
    @media shortHeight {
      inline-size: calc(100% - 24px * 2);
      margin-inline: 24px;
    }
  }
}

.slotContainer {
  container-type: inline-size;
  container-name: layouts-default-slot-container;

  max-inline-size: 768px;
  padding-block: 32px;
  margin-block: 0;
  margin-inline: auto;
  /* フッターが上／右に上がってこないようにする */
  min-block-size: calc(100svb - var(--header-bsize) - var(--footer-bsize));
  transition: opacity var(--page-trans-dur) var(--page-trans-func), filter var(--page-trans-dur) var(--page-trans-func);

  :root:where([data-writing-mode="horizontal-tb"], :not([data-writing-mode])) & {
    @media narrowWidth {
      inline-size: calc(100% - 24px * 2);
      margin-inline: 24px;
    }
  }

  :root:where([data-writing-mode="vertical-rl"]) & {
    @media shortHeight {
      inline-size: calc(100% - 24px * 2);
      margin-inline: 24px;
    }
  }
}

.menuOpened {
  opacity: 0;
  filter: blur(4px);
}
</style>
