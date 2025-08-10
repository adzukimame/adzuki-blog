<template>
  <ClientOnly>
    <LinkCardBody
      :url="$props.url"
      :data="data"
      :status="status" />
    <template #fallback>
      <NuxtLink
        :to="runtimeConfig.public.origin === urlObj.origin ? `${urlObj.pathname}${urlObj.search}` : url.toString()"
        :target="runtimeConfig.public.origin === urlObj.origin ? undefined : '_blank'"
        :class="$style.container">
        <div :class="$style.lettersContainer">
          <div :class="$style.title">
            {{ url }}
          </div>
          <div :class="$style.description">
            Loading url preview...
          </div>
          <div :class="$style.faviconAndHostnameContainer">
            <div :class="$style.favicon" />
            <div :class="$style.hostname">
              {{ urlObj.hostname }}
            </div>
          </div>
        </div>
      </NuxtLink>
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

<style module>
@value horizontalSmall, verticalSmall from "~/assets/css/breakpoints.module.css";

.container {
  --container-bsize: 5.4rem;
  block-size: var(--container-bsize);
  display: grid;
  grid-template-columns: auto 0;
  background-color: var(--bg-strong);
  border: solid 1px var(--split);
  border-radius: 6px;
  line-height: 2;
  transition: background-color var(--color-scheme-trans-dur);
}

.lettersContainer {
  display: grid;
  grid-template-rows: 40% 30% 30%;
  padding-inline: 0.8rem;
}

.title {
  display: block;
  font-size: 1rem;
  color: var(--fg);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: text-decoration var(--hover-trans-dur) var(--hover-trans-func), color var(--hover-trans-dur) var(--hover-trans-func);
}

@media (hover: hover) {
  .lettersContainer:hover>.title {
    color: var(--fg-strong);
    text-decoration: underline;
  }
}

@media (hover: none) {
  .lettersContainer:active>.title {
    color: var(--fg-strong);
    text-decoration: underline;
  }
}

.description {
  display: block;
  font-size: 0.8rem;
  color: var(--fg-weak);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  padding-inline-start: 0.5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
