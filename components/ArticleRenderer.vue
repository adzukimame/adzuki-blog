<template>
  <ContentRenderer :value="content"
                   tag="article"
                   :class="$style.renderer">
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
.renderer {
  display: block;
}

.renderer>:is(h1, h2, h3, h4, h5, h6) {
  margin-block-start: 1.8rem;
  margin-block-end: 1rem;
}

.renderer>h1 {
  color: var(--fgStrong);
  font-size: 1.6rem;
  padding-block-end: 1.2rem;
  border-block-end: solid 0.3rem var(--split);
}

.renderer>h2 {
  font-size: 1.3rem;
  border-block-end: solid 0.3rem var(--split);
}

.renderer>h3 {
  font-size: 1.1rem;
}

.renderer>h1:first-child {
  margin-block-start: 0;
}

.renderer p {
  margin-block: 1.8rem;
}

.renderer h2+p {
  margin-block-start: 1rem;
}

.renderer :not(h1, h2, h3, h4, h5, h6)>a {
  color: var(--accent);
}
</style>
