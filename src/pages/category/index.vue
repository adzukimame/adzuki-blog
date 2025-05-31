<template>
  <div>
    <div class="heading">
      カテゴリ一覧
    </div>
    <main>
      <ul class="category-list">
        <li
          v-for="item in categoryList"
          :key="item[0]"
          class="category-list-item">
          <NuxtLink :to="`/category/${item[0]}`">
            {{ `${item[0] === 'undefined' ? '未設定' : item[0]} (${item[1]})` }}
          </NuxtLink>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const { data } = await useAsyncData(() => queryContent('posts').only('category').find());

const categoryList = computed(() => {
  if (data.value === null) {
    return [];
  }

  const map = new Map<string, number>();

  data.value.forEach((content) => {
    const normalizedCategory = normalizeCategory(content.category);

    if (normalizedCategory === undefined) {
      map.set('undefined', (map.get('undefined') ?? 0) + 1);
    }
    else {
      for (const cat of normalizedCategory) {
        map.set(cat, (map.get(cat) ?? 0) + 1);
      }
    }
  });

  return Array.from(map).sort((a, b) => {
    if (a[0] === 'undefined') {
      return 1;
    }
    else if (b[0] === 'undefined') {
      return -1;
    }
    else if (runtimeConfig.public.hiddenCategoriesInRoot.includes(a[0]) && runtimeConfig.public.hiddenCategoriesInRoot.includes(b[0])) {
      return b[1] - a[1] || (a[0] > b[0] ? 1 : -1);
    }
    else if (runtimeConfig.public.hiddenCategoriesInRoot.includes(a[0])) {
      return 1;
    }
    else if (runtimeConfig.public.hiddenCategoriesInRoot.includes(b[0])) {
      return -1;
    }
    else {
      return b[1] - a[1] || (a[0] > b[0] ? 1 : -1);
    }
  });
});

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

<style scoped>
.heading {
  font-size: 1.2rem;
  padding-block-end: 0.4rem;
  border-block-end: solid 2px var(--split);
  margin-block-end: 2rem;
}

.category-list {
  display: block flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
  margin: 0;
  padding-inline-start: 1rem;
}

.category-list-item::before {
  content: '>';
  padding-inline-end: 0.5rem;
  color: var(--fgWeak);
}

.category-list-item>a {
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

@media (hover: hover) {
  .category-list-item>a:hover {
    color: var(--accent);
  }
}

@media (hover: none) {
  .category-list-item>a:active {
    color: var(--accent);
  }
}
</style>
