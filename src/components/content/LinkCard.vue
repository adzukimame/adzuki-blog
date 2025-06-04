<template>
  <ClientOnly>
    <div
      v-if="status === 'idle' || status === 'pending'"
      class="fallbackContainer">
      <div class="title">
        Loading url preview...
      </div>
    </div>
    <NuxtLink
      v-else
      :to="runtimeConfig.public.origin === urlObj.origin ? `${urlObj.pathname}${urlObj.search}` : url.toString()"
      :target="runtimeConfig.public.origin === urlObj.origin ? undefined : '_blank'"
      class="container"
      :class="{ withThumbnail: data?.thumbnail != null }">
      <div class="lettersContainer">
        <div
          class="title loaded"
          data-testid="title">
          {{ (data && data.title) ? data.title : url }}
        </div>
        <div
          class="description"
          data-testid="description">
          {{ (data && data.description) ? data.description : '説明はありません' }}
        </div>
        <div class="favicon-and-hostname-container">
          <img
            :src="data?.icon ?? undefined"
            class="favicon"
            :alt="`${urlObj.hostname} のfavicon画像`">
          <div
            class="hostname"
            data-testid="hostname">
            {{ urlObj.hostname }}
          </div>
        </div>
      </div>
      <img
        v-if="data?.thumbnail"
        :src="data.thumbnail"
        class="thumbnail">
    </NuxtLink>
    <template #fallback>
      <div class="fallbackContainer">
        <div class="title">
          Loading url preview...
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { SummalyResult } from '@misskey-dev/summaly/built/summary';

const props = defineProps<{
  url: string;
}>();

const runtimeConfig = useRuntimeConfig();

const urlObj = computed(() => new URL(props.url));

const { data, status } = await useLazyFetch<SummalyResult>(
  '/api/url-preview',
  {
    query: {
      url: props.url,
    },
    watch: [() => props.url],
    server: false,
  }
);
</script>

<style scoped>
.container {
  display: block grid;
  grid-template-columns: auto 0;
  background-color: var(--bgStrong);
  border: solid 1px var(--split);
  border-radius: 6px;
  line-height: 2;
  transition: background-color var(--colorSchemeTransitionDuration);
}

.container.withThumbnail {
  grid-template-columns: auto calc((2rem + 1.6rem + 1.6rem) * 16 / 9);
}

.lettersContainer {
  display: block grid;
  grid-template-rows: 2rem 1.6rem 1.6rem;
  padding-inline-start: 1rem;
}

.fallbackContainer {
  display: block grid;
  grid-template-rows: 2rem 1.6rem 1.6rem;
  padding-inline-start: 1rem;
  background-color: var(--bgStrong);
  border: solid 1px var(--split);
  border-radius: 6px;
  line-height: 2;
  transition: background-color var(--colorSchemeTransitionDuration);
}

.title {
  display: block;
  font-size: 1rem;
  color: var(--fg);
  overflow: clip;
  transition: text-decoration var(--hoverTransitionDuration) var(--hoverTransitionFunction);
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

.title:not(.loaded) {
  cursor: default;
}

@media (hover: hover) {
  .lettersContainer:hover>.title.loaded {
    color: var(--fgStrong);
    text-decoration: underline;
  }
}

@media (hover: none) {
  .lettersContainer:active>.title.loaded {
    color: var(--fgStrong);
    text-decoration: underline;
  }
}

.description {
  display: block;
  font-size: 0.8rem;
  color: var(--fgWeak);
  overflow: clip;
}

.favicon-and-hostname-container {
  display: block flex;
  font-size: 0.8rem;
  align-items: center;
}

.favicon {
  display: block;
  inline-size: 0.8rem;
  block-size: 0.8rem;
  object-fit: contain;
}

.hostname {
  color: var(--fg);
  overflow: clip;
  padding-inline-start: 0.5rem;
}

.thumbnail {
  block-size: calc(2rem + 1.6rem + 1.6rem);
  object-position: 50% 50%;
  object-fit: cover;
  margin-inline-start: auto;
}
</style>
