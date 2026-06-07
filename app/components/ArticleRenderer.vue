<template>
  <ContentRenderer
    v-if="content"
    :value="content"
    tag="article"
    class="articleRenderer block"
    :components="contentComponents" />
  <div v-else>
    <h2>コンテンツはありません</h2>
  </div>
</template>

<script setup lang="ts">
import type { PageCollectionItemBase } from '@nuxt/content';
import ArticleToc from './content/ArticleToc.vue';
import ImageViewer from './content/ImageViewer.vue';

defineProps<{
  content: PageCollectionItemBase | undefined;
}>();

const contentComponents = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  'article-toc': ArticleToc,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  'image-viewer': ImageViewer,
};
</script>

<style scoped>
.articleRenderer {
  &>:where(h1, h2, h3, h4, h5, h6) {
    margin-block-start: 1.8rem;
    margin-block-end: 1rem;
  }

  &>:where(h1) {
    color: var(--color-fg-strong);
    font-size: 1.6rem;
    padding-block-end: 1.2rem;
    border-block-end: solid 0.3rem var(--color-split);
  }

  &>:where(h2) {
    font-size: 1.3rem;
    border-block-end: solid 0.3rem var(--color-split);
  }

  &>:where(h3) {
    font-size: 1.1rem;
  }

  &>:where(h1:first-child) {
    margin-block-start: 0;
  }

  & :where(p) {
    margin-block: 1.8rem;
  }

  & :where(h2+p) {
    margin-block-start: 1rem;
  }

  & :where(:not(h1, h2, h3, h4, h5, h6, details *)>a) {
    color: var(--color-accent);
  }

  & :where(.article-toc) {
    margin-block: 2rem;
  }

  & :where(.image-viewer) {
    margin-block: 3rem;
  }

  & pre {
    writing-mode: horizontal-tb;
    white-space: pre-wrap;
    word-break: break-word;

    :root:where([data-writing-mode="vertical-rl"]) & {
      position: relative;
      height: 100%;
      max-width: min(calc(768px * 3 / 4), calc(100svw - var(--header-block-size)));
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
    }

    padding-block: 0.5rem;
    padding-inline: 1rem;
    border: solid 1px color-mix(in oklch, var(--color-fg-weak), var(--color-split) 70%);
    border-radius: 0.2rem;
    background-color: color-mix(in oklch, var(--color-bg-strong), var(--color-bg));
  }
}
</style>
