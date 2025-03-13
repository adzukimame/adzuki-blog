<template>
  <div>
    <div :class="$style.heading">
      カテゴリ一覧
    </div>
    <main>
      <ul :class="$style.categoryList">
        <li v-for="item in categoryList"
            :key="item[0]"
            :class="$style.categoryListItem">
          <NuxtLink :to="`/category/${item[0]}`">
            {{ `${item[0] !== 'undefined' ? item[0] : '未設定'} (${item[1]})` }}
          </NuxtLink>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncData(() => queryContent('posts').only('category').find());

const categoryList = computed(() => {
  if (data === null || data.value === null) {
    return [];
  }

  const map = new Map<string | undefined, number>();

  data.value.forEach((content) => {
    map.set(content.category ?? 'undefined', (map.get(content.category ?? 'undefined') ?? 0) + 1);
  });

  return Array.from(map).sort((a, b) => b[1] - a[1]);
});

const runtimeConfig = useRuntimeConfig();

useHead({
  title: 'カテゴリ一覧',
});

useServerSeoMeta({
  ogTitle: `カテゴリ一覧 - ${runtimeConfig.public.siteName}`,
  ogDescription: `カテゴリ一覧 - ${runtimeConfig.public.siteName}`,
});

useSeoMeta({
  description: `カテゴリ一覧 - ${runtimeConfig.public.siteName}`,
});
</script>

<style module>
.heading {
  font-size: 1.2rem;
  padding-block-end: 0.4rem;
  border-block-end: solid 2px var(--split);
  margin-block-end: 2rem;
}

.categoryList {
  display: block flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
  margin: 0;
  padding-inline-start: 1rem;
}

.categoryListItem::before {
  content: '>';
  padding-inline-end: 0.5rem;
  color: var(--fgWeak);
}

.categoryListItem>a {
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

@media (hover: hover) {
  .categoryListItem>a:hover {
    color: var(--accent);
  }
}

@media (hover: none) {
  .categoryListItem>a:active {
    color: var(--accent);
  }
}
</style>
