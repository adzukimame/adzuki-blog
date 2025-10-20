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
        <IconFolder />
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
        <IconClock />
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
  transition: background-color var(--hover-trans-dur) var(--hover-trans-func), border-bottom-color var(--hover-trans-dur) var(--hover-trans-func);
  --title-line-height: 1.8rem;
  --description-line-height: 1.4rem;

  @media (hover: hover) {
    &:hover {
      background-color: var(--bg-strong);
      border-bottom-color: var(--fg-weak);
    }
  }

  @media (hover: none) {
    &:active {
      background-color: var(--bg-strong);
      border-bottom-color: var(--fg-weak);
    }
  }
}

.titleAndDescriptionContainer {
  display: block grid;
  grid-template-rows: calc(var(--title-line-height) * 2) calc(var(--description-line-height) * 2);
  row-gap: 0.4rem;

  @media (hover: hover) {
    &:hover .title {
      color: var(--fg-strong);
    }
  }

  @media (hover: none) {
    &:active .title {
      color: var(--fg-strong);
    }
  }
}

.title {
  display: block;
  font-size: 1.2rem;
  line-height: var(--title-line-height);
  overflow: clip;
  transition: color var(--hover-trans-dur) var(--hover-trans-func);
}

.description {
  font-size: 0.8rem;
  line-height: var(--description-line-height);
  overflow: clip;
  color: var(--fg-weak);
}

.categoryAndDateContainer {
  display: block flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--fg-weak);
}

.categoryContainer {
  flex-wrap: wrap;
  display: block flex;
  align-items: center;

  &>:first-child {
    margin-inline-end: 0.2rem;
  }
}

.category {
  margin-inline-end: 0.7rem;
  transition: color var(--hover-trans-dur) var(--hover-trans-func);

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
      color: var(--fg);
    }
  }

  @media (hover: none) {
    &:active {
      text-decoration: underline;
      color: var(--fg);
    }
  }
}

.dateContainer {
  align-self: end;
  display: block flex;
  align-items: center;
  cursor: default;

  &>:first-child {
    margin-inline-end: 0.2rem;
  }
}
</style>
