<template>
  <details
    v-if="toc && toc.links.length > 0"
    :open="tocOpened ? true : undefined"
    class="article-toc"
    :class="$style.container"
    @toggle="(event) => {
      if (event.newState === 'open') { tocOpened = true }
      else if (event.newState === 'closed') { tocOpened = false }
    }">
    <summary
      :class="$style.summary"
      @click.prevent="onSummaryClick">
      <div>
        目次
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1.2rem"
        height="1.2rem"
        size="1.2rem"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="$style.accordionIcon">
        <path d="M6 9l6 6l6 -6" />
      </svg>
    </summary>
    <nav>
      <ul
        ref="listEl"
        :class="$style.list">
        <template
          v-for="item in toc.links"
          :key="item.id">
          <li :class="$style.listItemH2">
            <NuxtLink :to="`#${item.id}`">
              {{ item.text }}
            </NuxtLink>
          </li>
          <template v-if="item.children && item.children.length > 0">
            <li
              v-for="child in item.children"
              :key="child.id"
              :class="$style.listItemH3">
              <NuxtLink :to="`#${child.id}`">
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
  background-color: var(--bg-strong);
  border: solid 1px var(--split);
  border-radius: 6px;
  padding-inline: 1rem;
  padding-block: 0.3rem;
  transition: background-color var(--color-scheme-trans-dur);
}

.summary {
  display: block flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: color var(--hover-trans-dur) var(--hover-trans-func);
}

.summary::-webkit-details-marker {
  display: none;
}

@media (hover: hover) {
  .summary:hover {
    color: var(--fg-strong);
  }
}

@media (hover: none) {
  .summary:active {
    color: var(--fg-strong);
  }
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
  color: var(--fg-weak);
}

.list a {
  transition: color var(--hover-trans-dur) var(--hover-trans-func);
}

@media (hover: hover) {
  .list>li>a:hover {
    color: var(--fg-strong);
  }
}

@media (hover: none) {
  .list>li>a:active {
    color: var(--fg-strong);
  }
}
</style>
