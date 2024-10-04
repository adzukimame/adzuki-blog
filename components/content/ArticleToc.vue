<template>
  <details v-if="toc && toc.links.length > 0"
           :open="tocOpened ? true : undefined"
           class="articleToc"
           :class="$style.container"
           @toggle="(event) => {
             if (event.newState === 'open') { tocOpened = true }
             else if (event.newState === 'closed') { tocOpened = false }
           }">
    <summary :class="$style.summary"
             @click.prevent="onSummaryClick">
      <div>
        目次
      </div>
      <IconChevronDown :size="$style.accordionIconSize"
                       :class="$style.accordionIcon" />
    </summary>
    <ul ref="listEl"
        :class="$style.list">
      <template v-for="item in toc.links"
                :key="item.id">
        <li :class="$style.listItemH2">
          <NuxtLink :to="`#${item.id}`">
            {{ item.text }}
          </NuxtLink>
        </li>
        <template v-if="item.children && item.children.length > 0">
          <li v-for="child in item.children"
              :key="child.id"
              :class="$style.listItemH3">
            <NuxtLink :to="`#${child.id}`">
              {{ child.text }}
            </NuxtLink>
          </li>
        </template>
      </template>
    </ul>
  </details>
</template>

<script setup lang="ts">
import type { Toc } from '@nuxt/content';
import { IconChevronDown } from '@tabler/icons-vue';

const writingMode = useWritingMode();

defineProps<{
  toc: Toc | undefined;
}>();

const tocOpened = ref(false);

let animating = false;

const summaryTransitionDuration = 200;
const summaryTransitionDurationText = `${summaryTransitionDuration}ms`;
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

<style module>
.container {
  display: block;
  background-color: var(--bgStrong);
  border: solid 1px var(--split);
  border-radius: 6px;
  padding-inline: 1rem;
  padding-block: 0.3rem;
  transition: background-color var(--colorSchemeTransitionDuration);
}

.summary {
  display: block flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

.summary::-webkit-details-marker {
  display: none;
}

@media (hover: hover) {
  .summary:hover {
    color: var(--fgStrong);
  }
}

@media (hover: none) {
  .summary:active {
    color: var(--fgStrong);
  }
}

@value accordionIconSize 1.2rem;

:export {
  accordionIconSize: accordionIconSize;
}

.accordionIcon {
  transition: transform v-bind(summaryTransitionDurationText) v-bind(summaryTransitionFunction);
}

:root:global(.writing-mode-vertical-rl) .accordionIcon {
  transform: rotate(0.25turn);
}

.container[open] .accordionIcon {
  transform: rotate(0.5turn);
}

:root:global(.writing-mode-vertical-rl) .container[open] .accordionIcon {
  transform: rotate(0.75turn);
}

.list {
  display: block flex;
  flex-direction: column;
  padding-inline: 1rem;
  margin-block-start: 0.5rem;
  margin-block-end: 0;
  list-style-type: none;
  overflow: clip;
}

.list>li {
  display: block;
  padding-block: 0.2rem;
  border-block-start: dashed 1px var(--split);
}

.list>.listItemH2>a {
  color: var(--fg);
}

.listItemH3 {
  padding-inline-start: 1.5rem;
}

.list>.listItemH3>a {
  color: var(--fgWeak);
}

.list a {
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

@media (hover: hover) {
  .list>li>a:hover {
    color: var(--fgStrong);
  }
}

@media (hover: none) {
  .list>li>a:active {
    color: var(--fgStrong);
  }
}
</style>
