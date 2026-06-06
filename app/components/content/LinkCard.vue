<template>
  <ClientOnly>
    <NuxtLink
      :to="runtimeConfig.public.origin === urlObj.origin ? `${urlObj.pathname}${urlObj.search}` : url.toString()"
      :target="runtimeConfig.public.origin === urlObj.origin ? undefined : '_blank'"
      class="grid grid-cols-[auto_0] block-62 bg-bg-strong border border-split rounded-md transition-colors duration-500"
      :class="data?.thumbnail != null ? `grid-cols-[auto_calc(5.4rem*16/9)] viewport-max-md:grid-cols-[auto_0]` : ''">
      <div class="group/link-card grid grid-rows-[40%_30%_30%] px-8 py-4">
        <div
          class="text-base whitespace-nowrap text-ellipsis overflow-hidden text-fg hoverable:group-hover/link-card:text-fg-strong not-hoverable:group-active/link-card:text-fg-strong hoverable:group-hover/link-card:underline not-hoverable:group-active/link-card:underline transition-[text-decoration] duration-350 ease-out"
          data-testid="title">
          {{ (data && data.title) ? data.title : url }}
        </div>
        <div
          class="text-[0.8rem] text-fg-weak whitespace-nowrap text-ellipsis overflow-hidden"
          data-testid="description">
          {{ (data && data.description) ? data.description : ['idle', 'pending'].includes(status) ? 'Loading url preview...' : '説明はありません' }}
        </div>
        <div class="flex text-[0.8rem] items-center">
          <img
            v-if="status === 'success' && imgLoadStatus !== 'error'"
            loading="lazy"
            :src="data?.icon ?? undefined"
            class="block inline-8 block-8 object-contain"
            data-testid="favicon"
            :alt="imgLoadStatus === 'success' ? `${urlObj.hostname} のfavicon画像` : undefined"
            @loadstart="imgLoadStatus = 'loading'"
            @error="imgLoadStatus = 'error'">
          <div
            v-else
            class="block inline-8 block-8 object-contain" />
          <div
            class="text-fg ps-5 whitespace-nowrap text-ellipsis overflow-hidden"
            data-testid="hostname">
            {{ urlObj.hostname }}
          </div>
        </div>
      </div>
      <img
        v-if="data?.thumbnail"
        loading="lazy"
        :src="data.thumbnail"
        class="block-62 aspect-video object-[50%_50%] object-cover ms-auto viewport-max-md:hidden"
        data-testid="thumbnail">
    </NuxtLink>
    <template #fallback>
      <NuxtLink
        :to="runtimeConfig.public.origin === urlObj.origin ? `${urlObj.pathname}${urlObj.search}` : url.toString()"
        :target="runtimeConfig.public.origin === urlObj.origin ? undefined : '_blank'"
        class="grid grid-cols-[auto_0] block-62 bg-bg-strong border border-split rounded-md transition-colors duration-500">
        <div class="group/link-card grid grid-rows-[40%_30%_30%] px-8 py-4">
          <div class="text-base whitespace-nowrap text-ellipsis overflow-hidden text-fg hoverable:group-hover/link-card:text-fg-strong not-hoverable:group-active/link-card:text-fg-strong hoverable:group-hover/link-card:underline not-hoverable:group-active/link-card:underline transition-[text-decoration] duration-350 ease-out">
            {{ url }}
          </div>
          <div class="text-[0.8rem] text-fg-weak whitespace-nowrap text-ellipsis overflow-hidden">
            Loading url preview...
          </div>
          <div class="flex text-[0.8rem] items-center">
            <div class="block inline-8 block-8 object-contain" />
            <div class="text-fg ps-5 whitespace-nowrap text-ellipsis overflow-hidden">
              {{ urlObj.hostname }}
            </div>
          </div>
        </div>
        <div class="block-54 aspect-video object-[50%_50%] object-cover ms-auto viewport-max-md:hidden" />
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
