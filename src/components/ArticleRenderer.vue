<template>
  <ContentRenderer
    :value="content"
    tag="article"
    :class="$style.articleRenderer">
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

  :root:where([data-writing-mode="vertical-rl"]) & {
    height: 100%;
    max-width: min(calc(720px * 3 / 4), calc(100svw - var(--header-bsize)));

    text-wrap: wrap;

    overflow-y: scroll;
  }

  padding-block: 0.5rem;
  padding-inline: 1rem;
  border: solid 1px color-mix(in oklch, var(--fg-weak), var(--split) 70%);
  border-radius: 0.2rem;
  background-color: color-mix(in oklch, var(--bg-strong), var(--bg));
}
</style>
