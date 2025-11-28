<template>
  <div :class="$style.container">
    <NuxtLink
      :to="{
        path: route.path,
        query: { ...(route.query), ...(backwardEnabled ? { [pageQueryParam]: 1 } : {}) },
        hash: route.hash,
      }"
      :class="[$style.button, { [$style.disabled]: !backwardEnabled }]"
      :tabindex="backwardEnabled ? undefined : -1"
      :aria-hidden="backwardEnabled ? undefined : true"
      aria-label="最初のページに戻る">
      <IconChevronsLeft />
    </NuxtLink>
    <NuxtLink
      :to="{
        path: route.path,
        query: { ...(route.query), ...(backwardEnabled ? { [pageQueryParam]: currentPageNumber - 1 } : {}) },
        hash: route.hash,
      }"
      :class="[$style.button, { [$style.disabled]: !backwardEnabled }]"
      :tabindex="backwardEnabled ? undefined : -1"
      :aria-hidden="backwardEnabled ? undefined : true"
      aria-label="1ページ前に戻る">
      <IconChevronLeft />
    </NuxtLink>
    <div
      :class="[$style.button, $style.pageNumberOuter]"
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
      :class="[$style.button, { [$style.disabled]: !forwardEnabled }]"
      :tabindex="forwardEnabled ? undefined : -1"
      :aria-hidden="forwardEnabled ? undefined : true"
      aria-label="1ページ次に進む">
      <IconChevronRight />
    </NuxtLink>
    <NuxtLink
      :to="{
        path: route.path,
        query: { ...(route.query), ...(forwardEnabled ? { [pageQueryParam]: Math.ceil(itemsLength / itemsPerPage) } : {}) },
        hash: route.hash,
      }"
      :class="[$style.button, { [$style.disabled]: !forwardEnabled }]"
      :tabindex="forwardEnabled ? undefined : -1"
      :aria-hidden="forwardEnabled ? undefined : true"
      aria-label="最後のページに進む">
      <IconChevronsRight />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import IconChevronsLeft from '@/assets/icons/ChevronsLeft.svg';
import IconChevronLeft from '@/assets/icons/ChevronLeft.svg';
import IconChevronRight from '@/assets/icons/ChevronRight.svg';
import IconChevronsRight from '@/assets/icons/ChevronsRight.svg';

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

<style module>
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
  transition: border-block-end-color var(--hover-trans-dur) var(--hover-trans-func);

  &.disabled {
    pointer-events: none;

    &>svg {
      color: var(--fg-weak);
      opacity: 0.5;
    }
  }

  @media (hover: hover) {
    &:not(.pageNumberOuter, .disabled):hover {
      border-block-end-color: var(--fg-weak);
    }
  }

  @media (hover: none) {
    &:not(.pageNumberOuter, .disabled):active {
      border-block-end-color: var(--fg-weak);
    }
  }

  &.pageNumberOuter {
    font-size: 0.8rem;
    padding: calc((var(--button-size) - 1px * 2 - 0.8rem) / 2);
    cursor: default;
  }

  &>svg {
    margin: calc((var(--button-size) - 1px * 2 - var(--icon-size)) / 2);
    transition: filter var(--page-trans-dur) var(--page-trans-func);

    :root:where([data-writing-mode="vertical-rl"]) & {
      transform: rotate(0.25turn);
    }
  }
}
</style>
