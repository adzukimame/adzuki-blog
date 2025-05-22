<template>
  <ClientOnly>
    <NuxtLink v-if="data !== undefined"
              :to="runtimeConfig.public.origin === urlObj.origin ? `${urlObj.pathname}${urlObj.search}` : url.toString()"
              :target="runtimeConfig.public.origin === urlObj.origin ? undefined : '_blank'"
              :class="$style.container">
      <div :class="[$style.title, $style.loaded]">
        {{ (data && data.title) ? data.title : url }}
      </div>
      <div :class="$style.description">
        {{ (data && data.description) ? data.description : '説明はありません' }}
      </div>
      <div :class="$style.faviconAndHostnameContainer">
        <img :src="data?.icon ?? undefined"
             :class="$style.favicon"
             :alt="`${urlObj.hostname} のfavicon画像`">
        <div :class="$style.hostname">
          {{ urlObj.hostname }}
        </div>
      </div>
    </NuxtLink>
    <template v-else>
      <div :class="$style.container">
        <div :class="$style.title">
          Loading url preview...
        </div>
      </div>
    </template>
    <template #fallback>
      <div :class="$style.container">
        <div :class="$style.title">
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

const data = ref<SummalyResult | null | undefined>(undefined);

useFetch<SummalyResult>(
  '/api/url-preview',
  {
    query: {
      url: props.url,
    },
    watch: [() => props.url],
    server: false,
  }
).then(({ data: result }) => {
  // server: falseにすると、サーバーで必ずdataがnullになるので、クライアントの場合のみ代入する
  if (import.meta.client) {
    data.value = result.value;
  }
});
</script>

<style module>
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
