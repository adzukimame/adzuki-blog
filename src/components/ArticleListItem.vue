<template>
  <article :class="$style.container">
    <NuxtLink
      :to="item._path"
      :class="$style.titleAndDescriptionContainer"
      data-testid="link">
      <div
        :class="$style.title"
        data-testid="title">
        {{ item.title }}
      </div>
      <div
        :class="$style.description"
        data-testid="description">
        {{ item.description?.trim() ?? '…' }}
      </div>
    </NuxtLink>
    <div :class="$style.categoryAndDateContainer">
      <div
        :class="$style.categoryContainer"
        data-testid="category">
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
          <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
        </svg>
        <NuxtLink
          v-if="normalizedCategory === undefined"
          :to="'/category/undefined'"
          :class="$style.category">
          未設定
        </NuxtLink>
        <template v-else>
          <NuxtLink
            v-for="category in normalizedCategory"
            :key="category"
            :to="`/category/${category}`"
            :class="$style.category">
            {{ category }}
          </NuxtLink>
        </template>
      </div>
      <div
        :class="$style.dateContainer"
        data-testid="created">
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
          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
          <path d="M12 7v5l3 3" />
        </svg>
        <time
          v-if="!Number.isNaN(Date.parse(item.created))"
          :datetime="item.created">
          {{ new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.created)) }}
        </time>
        <div v-else>
          不明
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content';

const props = defineProps<{
  item: Pick<ParsedContent, '_id' | '_path' | 'title' | 'description' | 'category' | 'created'> | ParsedContent;
}>();

const normalizedCategory = computed<string[] | undefined>(() => normalizeCategory(props.item.category));
</script>

<style module>
.container {
  display: block flex;
  flex-direction: column;
  row-gap: 0.8rem;
  padding: 0.4rem;
  border-bottom: solid 0.4rem var(--split);
  transition: background-color var(--hoverTransitionDuration) var(--hoverTransitionFunction), border-bottom-color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
  --title-line-height: 1.8rem;
  --description-line-height: 1.4rem;
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
  grid-template-rows: calc(var(--title-line-height) * 2) calc(var(--description-line-height) * 2);
  row-gap: 0.4rem;
}

.title {
  display: block;
  font-size: 1.2rem;
  line-height: var(--title-line-height);
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
  line-height: var(--description-line-height);
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
  flex-wrap: wrap;
  display: block flex;
  align-items: center;
}

.categoryContainer>:first-child {
  margin-inline-end: 0.2rem;
}

.category {
  margin-inline-end: 0.7rem;
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

@media (hover: hover) {
  .category:hover {
    text-decoration: underline;
    color: var(--fg);
  }
}

@media (hover: none) {
  .category:active {
    text-decoration: underline;
    color: var(--fg);
  }
}

.dateContainer {
  flex-shrink: 0;
  align-self: end;
  display: block flex;
  align-items: center;
  cursor: default;
}

.dateContainer>:first-child {
  margin-inline-end: 0.2rem;
}
</style>
