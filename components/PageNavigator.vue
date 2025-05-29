<template>
  <div class="container">
    <NuxtLink
      :to="{
        path: route.path,
        query: { ...(route.query), ...(backwardEnabled ? { [pageQueryParam]: 1 } : {}) },
        hash: route.hash,
      }"
      class="button"
      :class="{ disabled: !backwardEnabled }"
      :tabindex="backwardEnabled ? undefined : -1"
      :aria-hidden="backwardEnabled ? undefined : true"
      aria-label="最初のページに戻る">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        size="1rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <path d="M11 7l-5 5l5 5" />
        <path d="M17 7l-5 5l5 5" />
      </svg>
    </NuxtLink>
    <NuxtLink
      :to="{
        path: route.path,
        query: { ...(route.query), ...(backwardEnabled ? { [pageQueryParam]: currentPageNumber - 1 } : {}) },
        hash: route.hash,
      }"
      class="button"
      :class="{ disabled: !backwardEnabled }"
      :tabindex="backwardEnabled ? undefined : -1"
      :aria-hidden="backwardEnabled ? undefined : true"
      aria-label="1ページ前に戻る">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        size="1rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <path d="M15 6l-6 6l6 6" />
      </svg>
    </NuxtLink>
    <div
      class="button page-number-outer"
      data-testid="page-number"
      :aria-label="`${currentPageNumber}ページ目`">
      <span ref="pageNumberEl">
        {{ pageNumberForDisplay }}
      </span>
    </div>
    <NuxtLink
      :to="{
        path: route.path,
        query: { ...(route.query), ...(forwardEnabled ? { [pageQueryParam]: currentPageNumber + 1 } : {}) },
        hash: route.hash,
      }"
      class="button"
      :class="{ disabled: !forwardEnabled }"
      :tabindex="forwardEnabled ? undefined : -1"
      :aria-hidden="forwardEnabled ? undefined : true"
      aria-label="1ページ次に進む">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        size="1rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <path d="M9 6l6 6l-6 6" />
      </svg>
    </NuxtLink>
    <NuxtLink
      :to="{
        path: route.path,
        query: { ...(route.query), ...(forwardEnabled ? { [pageQueryParam]: Math.ceil(itemsLength / itemsPerPage) } : {}) },
        hash: route.hash,
      }"
      class="button"
      :class="{ disabled: !forwardEnabled }"
      :tabindex="forwardEnabled ? undefined : -1"
      :aria-hidden="forwardEnabled ? undefined : true"
      aria-label="最後のページに進む">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        size="1rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true">
        <path d="M7 7l5 5l-5 5" />
        <path d="M13 7l5 5l-5 5" />
      </svg>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentPageNumber: number;
  itemsLength: number;
  itemsPerPage: number;
  pageQueryParam: string;
}>();

const appConfig = useAppConfig();
const route = useRoute();

const backwardEnabled = computed(() => props.itemsLength > 0 && props.currentPageNumber > 1);
const forwardEnabled = computed(() => props.currentPageNumber * props.itemsPerPage < props.itemsLength);

const pageNumberForDisplay = ref(props.currentPageNumber);
const pageNumberEl = ref<HTMLSpanElement | null>(null);

watch(() => props.currentPageNumber, (newPageNumber) => {
  const anim = pageNumberEl.value?.animate([
    { opacity: 1 },
    { opacity: 0, filter: 'blur(4px)' },
  ], {
    duration: appConfig.pageTransitionDuration,
    easing: appConfig.pageTransitionFunction,
  });

  anim?.addEventListener('finish', () => {
    pageNumberForDisplay.value = newPageNumber;

    pageNumberEl.value?.animate([
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
  .button:not(.page-number-outer, .disabled):hover {
    border-block-end-color: var(--fgWeak);
  }
}

@media (hover: none) {
  .button:not(.page-number-outer, .disabled):active {
    border-block-end-color: var(--fgWeak);
  }
}

.button.page-number-outer {
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
