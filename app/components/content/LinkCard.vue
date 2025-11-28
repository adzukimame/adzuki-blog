<template>
  <ClientOnly>
    <NuxtLink
      :to="runtimeConfig.public.origin === urlObj.origin ? `${urlObj.pathname}${urlObj.search}` : url.toString()"
      :target="runtimeConfig.public.origin === urlObj.origin ? undefined : '_blank'"
      :class="[$style.container, { [$style.withThumbnail]: data?.thumbnail != null }]">
      <div :class="$style.lettersContainer">
        <div
          :class="$style.title"
          data-testid="title">
          {{ (data && data.title) ? data.title : url }}
        </div>
        <div
          :class="$style.description"
          data-testid="description">
          {{ (data && data.description) ? data.description : ['idle', 'pending'].includes(status) ? 'Loading url preview...' : '説明はありません' }}
        </div>
        <div :class="$style.faviconAndHostnameContainer">
          <img
            v-if="status === 'success' && imgLoadStatus !== 'error'"
            loading="lazy"
            :src="data?.icon ?? undefined"
            :class="$style.favicon"
            data-testid="favicon"
            :alt="imgLoadStatus === 'success' ? `${urlObj.hostname} のfavicon画像` : undefined"
            @loadstart="imgLoadStatus = 'loading'"
            @error="imgLoadStatus = 'error'">
          <div
            v-else
            :class="$style.favicon" />
          <div
            :class="$style.hostname"
            data-testid="hostname">
            {{ urlObj.hostname }}
          </div>
        </div>
      </div>
      <img
        v-if="data?.thumbnail"
        loading="lazy"
        :src="data.thumbnail"
        :class="$style.thumbnail"
        data-testid="thumbnail">
    </NuxtLink>
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
        <div :class="$style.thumbnail" />
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

<style module>
@value narrowWidth, shortHeight from "~/assets/css/breakpoints.module.css";

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

.container.withThumbnail {
  grid-template-columns: auto calc(var(--container-bsize) * 16 / 9);

  :root:where([data-writing-mode="horizontal-tb"], :not([data-writing-mode])) & {
    @media narrowWidth {
      grid-template-columns: auto 0;
    }
  }

  :root:where([data-writing-mode="vertical-rl"]) & {
    @media shortHeight {
      grid-template-columns: auto 0;
    }
  }
}

.lettersContainer {
  display: grid;
  grid-template-rows: 40% 30% 30%;
  padding-inline: 0.8rem;

  @media (hover: hover) {
    &:hover>.title {
      color: var(--fg-strong);
      text-decoration: underline;
    }
  }

  @media (hover: none) {
    &:active>.title {
      color: var(--fg-strong);
      text-decoration: underline;
    }
  }
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

.thumbnail {
  block-size: var(--container-bsize);
  aspect-ratio: 16 / 9;
  object-position: 50% 50%;
  object-fit: cover;
  margin-inline-start: auto;

  :root:where([data-writing-mode="horizontal-tb"], :not([data-writing-mode])) & {
    @media narrowWidth {
      display: none;
    }
  }

  :root:where([data-writing-mode="vertical-rl"]) & {
    @media shortHeight {
      display: none;
    }
  }
}
</style>
