<template>
  <ContentRenderer
    v-if="content"
    :value="content"
    tag="article"
    :class="$style.articleRenderer"
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
  'article-toc': ArticleToc,
  'image-viewer': ImageViewer,
};
</script>

<style module>
.articleRenderer {
  display: block;
}

.articleRenderer>:where(h1, h2, h3, h4, h5, h6) {
  margin-block-start: 1.8rem;
  margin-block-end: 1rem;
}

.articleRenderer>h1 {
  color: var(--fg-strong);
  font-size: 1.6rem;
  padding-block-end: 1.2rem;
  border-block-end: solid 0.3rem var(--split);
}

.articleRenderer>h2 {
  font-size: 1.3rem;
  border-block-end: solid 0.3rem var(--split);
}

.articleRenderer>h3 {
  font-size: 1.1rem;
}

.articleRenderer>h1:first-child {
  margin-block-start: 0;
}

.articleRenderer p {
  margin-block: 1.8rem;
}

.articleRenderer h2+p {
  margin-block-start: 1rem;
}

.articleRenderer :not(h1, h2, h3, h4, h5, h6)>a {
  color: var(--accent);
}

.articleRenderer :global(.article-toc) {
  margin-block: 2rem;
}

.articleRenderer :global(.image-viewer) {
  margin-block: 3rem;
}

.articleRenderer pre {
  writing-mode: horizontal-tb;
  white-space: pre-wrap;
  word-break: break-word;

  :root:where([data-writing-mode="vertical-rl"]) & {
    position: relative;
    height: 100%;
    max-width: min(calc(768px * 3 / 4), calc(100svw - var(--header-bsize)));
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  padding-block: 0.5rem;
  padding-inline: 1rem;
  border: solid 1px color-mix(in oklch, var(--fg-weak), var(--split) 70%);
  border-radius: 0.2rem;
  background-color: color-mix(in oklch, var(--bg-strong), var(--bg));
}
</style>
