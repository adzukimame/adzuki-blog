<template>
  <ClientOnly>
    <div v-if="status === 'idle' || status === 'pending'"
         class="container">
      <div class="title">
        Loading url preview...
      </div>
    </div>
    <NuxtLink v-else
              :to="runtimeConfig.public.origin === urlObj.origin ? `${urlObj.pathname}${urlObj.search}` : url.toString()"
              :target="runtimeConfig.public.origin === urlObj.origin ? undefined : '_blank'"
              class="container">
      <div class="title loaded">
        {{ (data && data.title) ? data.title : url }}
      </div>
      <div class="description">
        {{ (data && data.description) ? data.description : '説明はありません' }}
      </div>
      <div class="faviconAndHostnameContainer">
        <img :src="data?.icon ?? undefined"
             class="favicon"
             :alt="`${urlObj.hostname} のfavicon画像`">
        <div class="hostname">
          {{ urlObj.hostname }}
        </div>
      </div>
    </NuxtLink>
    <template #fallback>
      <div class="container">
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
  .container:hover>.title.loaded {
    color: var(--fgStrong);
    text-decoration: underline;
  }
}

@media (hover: none) {
  .container:active>.title.loaded {
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

.faviconAndHostnameContainer {
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
</style>
