<template>
  <article class="container flex flex-col gap-y-8 p-4 border-b-[0.4rem] border-split transition-colors duration-(--duration-hover) ease-(--ease-hover) responsive-hover:bg-bg-strong responsive-hover:border-fg-weak">
    <NuxtLink
      :to="item.path"
      class="group/article-list-item grid grid-rows-[3.6rem_2.8rem] gap-y-4"
      data-testid="link">
      <div
        class="text-[1.2rem] leading-18 overflow-clip transition-colors duration-(--duration-hover) ease-(--ease-hover) group-responsive-hover/article-list-item:text-fg-strong"
        data-testid="title">
        {{ item.title }}
      </div>
      <div
        class="text-[0.8rem] leading-14 overflow-clip text-fg-weak"
        data-testid="description">
        {{ item.description?.trim() ?? '…' }}
      </div>
    </NuxtLink>
    <div class="flex justify-between text-[0.8rem] text-fg-weak">
      <div
        class="flex flex-wrap items-center"
        data-testid="category">
        <IconFolder class="me-2" />
        <NuxtLink
          v-if="normalizedCategory === undefined"
          :to="'/category/undefined'"
          class="me-7 transition-colors duration-(--duration-hover) ease-(--ease-hover) responsive-hover:underline responsive-hover:text-fg">
          未設定
        </NuxtLink>
        <template v-else>
          <NuxtLink
            v-for="category in normalizedCategory"
            :key="category"
            :to="`/category/${category}`"
            class="me-7 transition-colors duration-(--duration-hover) ease-(--ease-hover) responsive-hover:underline responsive-hover:text-fg">
            {{ category }}
          </NuxtLink>
        </template>
      </div>
      <div
        class="flex self-end items-center cursor-default"
        data-testid="created">
        <IconClock class="me-2" />
        <time
          v-if="item.created && !Number.isNaN(Date.parse(item.created))"
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
import type { PostsCollectionItem, PagesCollectionItem } from '@nuxt/content';
import IconFolder from '@/assets/icons/Folder.svg';
import IconClock from '@/assets/icons/Clock.svg';

const props = defineProps<{
  item: Pick<PostsCollectionItem, 'id' | 'path' | 'title' | 'description' | 'category' | 'created'> | PostsCollectionItem | Pick<PagesCollectionItem, 'id' | 'path' | 'title' | 'description' | 'category' | 'created'> | PagesCollectionItem;
}>();

const normalizedCategory = computed<string[] | undefined>(() => normalizeCategory(props.item.category));
</script>
