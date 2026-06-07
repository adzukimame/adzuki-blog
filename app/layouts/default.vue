<template>
  <div>
    <!-- vertical-rlだとなぜかinset-block-startが効かない -->
    <div
      class="sticky z-2 block-header-block border-be-2 border-split bg-bg text-fg-strong horizontal:inset-bs-0 vertical:right-0 transition-[background-color,transform] duration-[var(--duration-color-scheme),var(--duration-page-transition)] ease-[ease,ease-in-out]"
      :class="headerVisible ? '' : 'horizontal:transform-[translateY(-100%)] vertical:transform-[translateX(100%)]'">
      <AppHeader
        class="max-inline-[768px] mx-auto viewport-max-md:inline-[calc(100%-24px*2)] viewport-max-md:mx-[24px]"
        :use-collapsible-navigation="isNarrow"
        @menu-opened="menuOpened = true"
        @menu-closed="menuOpened = false" />
    </div>
    <LoadingIndicator />
    <div
      class="max-inline-[768px] py-[32px] mx-auto my-0 min-block-[calc(100svb-var(--spacing-header-block)-var(--spacing-footer-block))] viewport-max-md:inline-[calc(100%-24px*2)] viewport-max-md:mx-[24px] transition-[opacity,filter] duration-[var(--duration-page-transition),var(--duration-page-transition)] ease-[var(--ease-page-transition),var(--ease-page-transition)]"
      :class="menuOpened ? 'opacity-0 blur-xs' : ''"
      :inert="menuOpened ? true : undefined"
      :aria-hidden="menuOpened ? true : undefined"
      data-testid="slot-container">
      <slot />
    </div>
    <AppFooter
      :class="menuOpened ? 'opacity-0 blur-xs' : ''"
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
  isNarrow.value = writingMode.value === 'vertical-rl' ? window.innerHeight < NARROW_THRESHOLD : window.innerWidth < NARROW_THRESHOLD;

  window.addEventListener('resize', () => {
    isNarrow.value = writingMode.value === 'vertical-rl' ? window.innerHeight < NARROW_THRESHOLD : window.innerWidth < NARROW_THRESHOLD;
    if (!isNarrow.value) {
      menuOpened.value = false;
    }
  });

  window.addEventListener('scroll', updateScrollDirection, { passive: true });
});
</script>
