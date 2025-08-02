<template>
  <div>
    <div :class="$style.heading">
      カテゴリ一覧
    </div>
    <main>
      <ul :class="$style.categoryList">
        <li
          v-for="item in categoryList"
          :key="item[0]"
          :class="$style.categoryListItem">
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

  return Array.from(map).sort((a, b) =>
    a[0] === 'undefined'
      ? 1
      : b[0] === 'undefined'
        ? -1
        : b[1] - a[1] || (a[0] > b[0] ? 1 : -1)
  );
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
  color: var(--fg-weak);
}

.categoryListItem>a {
  transition: color var(--hover-trans-dur) var(--hover-trans-func);
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
