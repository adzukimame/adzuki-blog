<template>
  <div class="container flex flex-row flex-wrap justify-center block-22 gap-x-px">
    <NuxtLink
      :to="{
        path: route.path,
        query: { ...(route.query), ...(backwardEnabled ? { [pageQueryParam]: 1 } : {}) },
        hash: route.hash,
      }"
      class="group block text-center leading-[0.7] content-center min-inline-22 border-be-[0.3rem] border-split aria-hidden:pointer-events-none transition-colors duration-350 ease-out responsive-hover:border-fg-weak"
      :tabindex="backwardEnabled ? undefined : -1"
      :aria-hidden="backwardEnabled ? undefined : true"
      aria-label="最初のページに戻る">
      <IconChevronsLeft class="text-base m-[calc((2.2rem-1px*2-1rem)/2)] transition-[filter] duration-250 ease-in vertical:transform-[rotate(0.25turn)] group-aria-[hidden]:text-fg-weak group-aria-[hidden]:opacity-50" />
    </NuxtLink>
    <NuxtLink
      :to="{
        path: route.path,
        query: { ...(route.query), ...(backwardEnabled ? { [pageQueryParam]: currentPageNumber - 1 } : {}) },
        hash: route.hash,
      }"
      class="group block text-center leading-[0.7] content-center min-inline-22 border-be-[0.3rem] border-split aria-hidden:pointer-events-none transition-colors duration-350 ease-out responsive-hover:border-fg-weak"
      :tabindex="backwardEnabled ? undefined : -1"
      :aria-hidden="backwardEnabled ? undefined : true"
      aria-label="1ページ前に戻る">
      <IconChevronLeft class="text-base m-[calc((2.2rem-1px*2-1rem)/2)] transition-[filter] duration-250 ease-in vertical:transform-[rotate(0.25turn)] group-aria-[hidden]:text-fg-weak group-aria-[hidden]:opacity-50" />
    </NuxtLink>
    <div
      class="block text-center leading-[0.7] content-center min-inline-22 border-be-[0.3rem] border-split text-[0.8rem] p-[calc((2.2rem-1px*2-0.8rem)/2)] cursor-default"
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
      class="group block text-center leading-[0.7] content-center min-inline-22 border-be-[0.3rem] border-split aria-hidden:pointer-events-none transition-colors duration-350 ease-out responsive-hover:border-fg-weak"
      :tabindex="forwardEnabled ? undefined : -1"
      :aria-hidden="forwardEnabled ? undefined : true"
      aria-label="1ページ次に進む">
      <IconChevronRight class="text-base m-[calc((2.2rem-1px*2-1rem)/2)] transition-[filter] duration-250 ease-in vertical:transform-[rotate(0.25turn)] group-aria-[hidden]:text-fg-weak group-aria-[hidden]:opacity-50" />
    </NuxtLink>
    <NuxtLink
      :to="{
        path: route.path,
        query: { ...(route.query), ...(forwardEnabled ? { [pageQueryParam]: Math.ceil(itemsLength / itemsPerPage) } : {}) },
        hash: route.hash,
      }"
      class="group block text-center leading-[0.7] content-center min-inline-22 border-be-[0.3rem] border-split aria-hidden:pointer-events-none transition-colors duration-350 ease-out responsive-hover:border-fg-weak"
      :tabindex="forwardEnabled ? undefined : -1"
      :aria-hidden="forwardEnabled ? undefined : true"
      aria-label="最後のページに進む">
      <IconChevronsRight class="text-base m-[calc((2.2rem-1px*2-1rem)/2)] transition-[filter] duration-250 ease-in vertical:transform-[rotate(0.25turn)] group-aria-[hidden]:text-fg-weak group-aria-[hidden]:opacity-50" />
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
