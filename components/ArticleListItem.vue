<template>
  <article :class="$style.container">
    <NuxtLink :to="item._path"
              :class="$style.titleAndDescriptionContainer">
      <div :class="$style.title">
        {{ item.title }}
      </div>
      <div :class="$style.description">
        {{ item.hideDescription ? '…' : item.description }}
      </div>
    </NuxtLink>
    <div :class="$style.categoryAndDateContainer">
      <div :class="$style.categoryContainer">
        <IconFolder size="1rem"
                    aria-hidden="true" />
        <NuxtLink :to="item.category !== undefined ? `/category/${item.category}` : undefined"
                  :class="[$style.category, { [$style.noCategory]: item.category === undefined }]">
          {{ item.category !== undefined ? item.category : '未設定' }}
        </NuxtLink>
      </div>
      <div :class="$style.dateContainer">
        <IconClock size="1rem"
                   aria-hidden="true" />
        <time v-if="!Number.isNaN(Date.parse(item.created))"
              :datetime="item.created"
              :class="$style.date">
          {{ new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.created)) }}
        </time>
        <div v-else
             :class="$style.date">
          不明
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content';
import { IconFolder, IconClock } from '@tabler/icons-vue';

defineProps<{
  item: Pick<ParsedContent, '_id' | '_path' | 'title' | 'description' | 'category' | 'created' | 'hideDescription'> | ParsedContent;
}>();
</script>

<style module>
@value titleLineHeight 1.8rem;
@value descriptionLineHeight 1.4rem;
@value titleAndDescriptionContainerRowGap 0.4rem;

.container {
  display: block grid;
  grid-template-rows: calc(titleLineHeight * 2 + descriptionLineHeight * 2 + titleAndDescriptionContainerRowGap) 1rem;
  row-gap: 0.8rem;
  padding: 0.4rem;
  border-bottom: solid 0.4rem var(--split);
  transition: background-color var(--hoverTransitionDuration) var(--hoverTransitionFunction), border-bottom-color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

@media (hover: hover) {
  .container:hover {
    background-color: var(--bgStrong);
    border-bottom-color: var(--fgWeak);
  }
}

@media (hover: none) {
  .container:active {
    background-color: var(--bgStrong);
    border-bottom-color: var(--fgWeak);
  }
}

.titleAndDescriptionContainer {
  display: block grid;
  grid-template-rows: calc(titleLineHeight * 2) calc(descriptionLineHeight * 2);
  row-gap: titleAndDescriptionContainerRowGap;
}

.title {
  display: block;
  font-size: 1.2rem;
  line-height: titleLineHeight;
  overflow: clip;
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

@media (hover: hover) {
  .titleAndDescriptionContainer:hover .title {
    color: var(--fgStrong);
  }
}

@media (hover: none) {
  .titleAndDescriptionContainer:active .title {
    color: var(--fgStrong);
  }
}

.description {
  font-size: 0.8rem;
  line-height: descriptionLineHeight;
  overflow: clip;
  color: var(--fgWeak);
}

.categoryAndDateContainer {
  display: block flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--fgWeak);
}

.categoryContainer {
  display: block flex;
  align-items: center;
}

.category {
  padding-inline-start: 0.2rem;
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

.noCategory {
  cursor: default;
}

@media (hover: hover) {
  .category:not(.noCategory):hover {
    text-decoration: underline;
    color: var(--fg);
  }
}

@media (hover: none) {
  .category:not(.noCategory):active {
    text-decoration: underline;
    color: var(--fg);
  }
}

.dateContainer {
  display: block flex;
  align-items: center;
  cursor: default;
}

.date {
  padding-inline-start: 0.2rem;
}
</style>
