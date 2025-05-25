<template>
  <div class="container">
    <NuxtLink :to="{
                path: $route.path,
                query: { ...($route.query), ...(backwardEnabled ? { [pageQueryParam]: 1 } : {}) },
                hash: $route.hash,
              }"
              class="button"
              :class="{ disabled: !backwardEnabled }"
              :tabindex="backwardEnabled ? undefined : -1"
              :aria-hidden="backwardEnabled ? undefined : true"
              aria-label="最初のページに戻る">
      <IconChevronsLeft size="1rem"
                        aria-hidden="true" />
    </NuxtLink>
    <NuxtLink :to="{
                path: $route.path,
                query: { ...($route.query), ...(backwardEnabled ? { [pageQueryParam]: currentPageNumber - 1 } : {}) },
                hash: $route.hash,
              }"
              class="button"
              :class="{ disabled: !backwardEnabled }"
              :tabindex="backwardEnabled ? undefined : -1"
              :aria-hidden="backwardEnabled ? undefined : true"
              aria-label="1ページ前に戻る">
      <IconChevronLeft size="1rem"
                       aria-hidden="true" />
    </NuxtLink>
    <div class="button pageNumberOuter"
         data-testid="page-number"
         :aria-label="`${currentPageNumber}ページ目`">
      <span ref="pageNumberSpanEl">
        {{ pageNumberForDisplay }}
      </span>
    </div>
    <NuxtLink :to="{
                path: $route.path,
                query: { ...($route.query), ...(forwardEnabled ? { [pageQueryParam]: currentPageNumber + 1 } : {}) },
                hash: $route.hash,
              }"
              class="button"
              :class="{ disabled: !forwardEnabled }"
              :tabindex="forwardEnabled ? undefined : -1"
              :aria-hidden="forwardEnabled ? undefined : true"
              aria-label="1ページ次に進む">
      <IconChevronRight size="1rem"
                        aria-hidden="true" />
    </NuxtLink>
    <NuxtLink :to="{
                path: $route.path,
                query: { ...($route.query), ...(forwardEnabled ? { [pageQueryParam]: Math.ceil(itemsLength / itemsPerPage) } : {}) },
                hash: $route.hash,
              }"
              class="button"
              :class="{ disabled: !forwardEnabled }"
              :tabindex="forwardEnabled ? undefined : -1"
              :aria-hidden="forwardEnabled ? undefined : true"
              aria-label="最後のページに進む">
      <IconChevronsRight size="1rem"
                         aria-hidden="true" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { IconChevronLeft, IconChevronsLeft, IconChevronRight, IconChevronsRight } from '@tabler/icons-vue';

const props = defineProps<{
  currentPageNumber: number;
  itemsLength: number;
  itemsPerPage: number;
  pageQueryParam: string;
}>();

const appConfig = useAppConfig();

const backwardEnabled = computed(() => props.itemsLength > 0 && props.currentPageNumber > 1);
const forwardEnabled = computed(() => props.currentPageNumber * props.itemsPerPage < props.itemsLength);

const pageNumberForDisplay = ref(props.currentPageNumber);
const pageNumberSpanEl = ref<HTMLSpanElement | null>(null);

watch(() => props.currentPageNumber, (newPageNumber) => {
  const anim = pageNumberSpanEl.value?.animate([
    { opacity: 1 },
    { opacity: 0, filter: 'blur(4px)' },
  ], {
    duration: appConfig.pageTransitionDuration,
    easing: appConfig.pageTransitionFunction,
  });

  anim?.addEventListener('finish', () => {
    pageNumberForDisplay.value = newPageNumber;

    pageNumberSpanEl.value!.animate([
      { opacity: 0, filter: 'blur(4px)' },
      { opacity: 1 },
    ], {
      duration: appConfig.pageTransitionDuration,
      easing: appConfig.pageTransitionFunction,
    });
  });
});
</script>

<style scoped>
.container {
  --button-size: 2.2rem;
  --icon-size: 1rem;
  display: block flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  block-size: var(--button-size);
  column-gap: 1px;
}

.button {
  display: block;
  text-align: center;
  line-height: 0.7;
  align-content: center;
  min-inline-size: var(--button-size);
  border-block-end: solid 0.3rem var(--split);
  transition: border-block-end-color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

.button.disabled {
  pointer-events: none;
}

@media (hover: hover) {
  .button:not(.pageNumberOuter, .disabled):hover {
    border-block-end-color: var(--fgWeak);
  }
}

@media (hover: none) {
  .button:not(.pageNumberOuter, .disabled):active {
    border-block-end-color: var(--fgWeak);
  }
}

.button.pageNumberOuter {
  font-size: 0.8rem;
  padding: calc((var(--button-size) - 1px * 2 - 0.8rem) / 2);
  cursor: default;
}

.button>svg {
  margin: calc((var(--button-size) - 1px * 2 - var(--icon-size)) / 2);
  transition: filter var(--pageTransitionDuration) var(--pageTransitionFunction);
}

.button.disabled>svg {
  color: var(--fgWeak);
  opacity: 0.5;
}

:root.writing-mode-vertical-rl .button>svg {
  transform: rotate(0.25turn);
}
</style>
