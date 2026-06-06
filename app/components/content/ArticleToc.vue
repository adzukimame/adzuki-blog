<template>
  <details
    v-if="toc && toc.links.length > 0"
    :open="tocOpened ? true : undefined"
    class="article-toc group/article-toc bg-bg-strong px-10 py-3 border border-split rounded-md transition-colors duration-500"
    @toggle="(event) => {
      if (event.newState === 'open') { tocOpened = true }
      else if (event.newState === 'closed') { tocOpened = false }
    }">
    <summary
      class="summary flex flex-row items-center justify-between responsive-hover:text-fg-strong cursor-pointer transition-colors duration-350 ease-out"
      @click.prevent="onSummaryClick">
      <div>
        目次
      </div>
      <IconChevronDown class="block-12 inline-12 transition-transform duration-200 ease-out vertical:transform-[rotate(0.25turn)] group-open/article-toc:transform-[rotate(0.5turn)] vertical:group-open/article-toc:transform-[rotate(0.75turn)]" />
    </summary>
    <nav>
      <ul
        ref="listEl"
        class="flex flex-col px-10 mbs-5 mbe-0 overflow-clip">
        <template
          v-for="item in toc.links"
          :key="item.id">
          <li class="py-2 border-bs border-dashed border-split">
            <NuxtLink
              class="responsive-hover:text-fg-strong transition-colors duration-350 ease-out"
              :to="`#${item.id}`">
              {{ item.text }}
            </NuxtLink>
          </li>
          <template v-if="item.children && item.children.length > 0">
            <li
              v-for="child in item.children"
              :key="child.id"
              class="py-2 ps-15 border-bs border-dashed border-split">
              <NuxtLink
                class="text-fg-weak responsive-hover:text-fg-strong transition-colors duration-350 ease-out"
                :to="`#${child.id}`">
                {{ child.text }}
              </NuxtLink>
            </li>
          </template>
        </template>
      </ul>
    </nav>
  </details>
</template>

<script setup lang="ts">
import type { Toc } from '@nuxt/content';
import IconChevronDown from '@/assets/icons/ChevronDown.svg';

const writingMode = useWritingMode();

defineProps<{
  toc: Toc | undefined;
}>();

const tocOpened = ref(false);

let animating = false;

const summaryTransitionDuration = 200;
const summaryTransitionFunction = 'ease-out';

const listEl = ref<HTMLUListElement | null>(null);

const onSummaryClick = (_event: MouseEvent) => {
  if (animating) {
    return;
  }
  animating = true;

  // closing
  if (tocOpened.value) {
    const anim = listEl.value?.animate([
      {
        blockSize: `${writingMode.value === 'vertical-rl' ? listEl.value.offsetWidth : listEl.value.offsetHeight}px`,
        opacity: 1,
      },
      { blockSize: 0, opacity: 0 },
    ], {
      duration: summaryTransitionDuration,
      easing: summaryTransitionFunction,
    });

    anim?.addEventListener('finish', () => {
      tocOpened.value = false;
      animating = false;
    });
  }
  // opening
  else {
    tocOpened.value = true;

    nextTick(() => {
      const anim = listEl.value?.animate([
        { blockSize: 0, opacity: 0 },
        {
          blockSize: `${writingMode.value === 'vertical-rl' ? listEl.value.offsetWidth : listEl.value.offsetHeight}px`,
          opacity: 1,
        },
      ], {
        duration: summaryTransitionDuration,
        easing: summaryTransitionFunction,
      });

      anim?.addEventListener('finish', () => {
        animating = false;
      });
    });
  }
};
</script>

<style scoped>
.summary::-webkit-details-marker {
  display: none;
}
</style>
