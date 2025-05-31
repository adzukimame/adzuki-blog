<template>
  <ContentRenderer
    :value="content"
    tag="article"
    class="article-renderer">
    <template #empty>
      <h2>コンテンツはありません</h2>
    </template>
  </ContentRenderer>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content';

defineProps<{
  content: ParsedContent | undefined;
}>();
</script>

<style>
.article-renderer {
  display: block;
}

.article-renderer>:is(h1, h2, h3, h4, h5, h6) {
  margin-block-start: 1.8rem;
  margin-block-end: 1rem;
}

.article-renderer>h1 {
  color: var(--fgStrong);
  font-size: 1.6rem;
  padding-block-end: 1.2rem;
  border-block-end: solid 0.3rem var(--split);
}

.article-renderer>h2 {
  font-size: 1.3rem;
  border-block-end: solid 0.3rem var(--split);
}

.article-renderer>h3 {
  font-size: 1.1rem;
}

.article-renderer>h1:first-child {
  margin-block-start: 0;
}

.article-renderer p {
  margin-block: 1.8rem;
}

.article-renderer h2+p {
  margin-block-start: 1rem;
}

.article-renderer :not(h1, h2, h3, h4, h5, h6)>a {
  color: var(--accent);
}

.article-renderer .article-toc {
  margin-block: 2rem;
}

.article-renderer .image-viewer {
  margin-block: 3rem;
}
</style>
