<template>
  <ClientOnly>
    <NuxtLink
      :to="runtimeConfig.public.origin === urlObj.origin ? `${urlObj.pathname}${urlObj.search}` : url.toString()"
      :target="runtimeConfig.public.origin === urlObj.origin ? undefined : '_blank'"
      class="container"
      :class="{ withThumbnail: data?.thumbnail != null }">
      <div class="lettersContainer">
        <div
          class="title"
          data-testid="title">
          {{ (data && data.title) ? data.title : url }}
        </div>
        <div
          class="description"
          data-testid="description">
          {{ (data && data.description) ? data.description : ['idle', 'pending'].includes(status) ? 'Loading url preview...' : '説明はありません' }}
        </div>
        <div class="favicon-and-hostname-container">
          <img
            v-if="status === 'success' && imgLoadStatus !== 'error'"
            :src="data?.icon ?? undefined"
            class="favicon"
            :alt="imgLoadStatus === 'success' ? `${urlObj.hostname} のfavicon画像` : undefined"
            @loadstart="imgLoadStatus = 'loading'"
            @error="imgLoadStatus = 'error'">
          <div
            v-else
            class="favicon" />
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
      <NuxtLink
        :to="runtimeConfig.public.origin === urlObj.origin ? `${urlObj.pathname}${urlObj.search}` : url.toString()"
        :target="runtimeConfig.public.origin === urlObj.origin ? undefined : '_blank'"
        class="container">
        <div class="lettersContainer">
          <div class="title">
            {{ url }}
          </div>
          <div class="description">
            Loading url preview...
          </div>
          <div class="favicon-and-hostname-container">
            <div class="favicon" />
            <div
              class="hostname"
              data-testid="hostname">
              {{ urlObj.hostname }}
            </div>
          </div>
        </div>
        <div class="thumbnail" />
      </NuxtLink>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { SummalyResult } from '@misskey-dev/summaly/built/summary';

const props = defineProps<{
  url: string;
}>();

const imgLoadStatus = ref<'beforestart' | 'loading' | 'success' | 'error'>('beforestart');

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

.title {
  display: block;
  font-size: 1rem;
  color: var(--fg);
  overflow: clip;
  transition: text-decoration var(--hoverTransitionDuration) var(--hoverTransitionFunction);
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

@media (hover: hover) {
  .lettersContainer:hover>.title {
    color: var(--fgStrong);
    text-decoration: underline;
  }
}

@media (hover: none) {
  .lettersContainer:active>.title {
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
