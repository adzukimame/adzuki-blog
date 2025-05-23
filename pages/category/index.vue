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
  if (data === null || data.value === null) {
    return [];
  }

  const map = new Map<string, number>();

  data.value.forEach((content) => {
    if (Array.isArray(content.category)) {
      const filtered: Array<string> = content.category.filter((el, idx, arr) => typeof el === 'string' && el !== 'undefined' && arr.indexOf(el) === idx);

      if (filtered.length === 0) {
        map.set('undefined', (map.get('undefined') ?? 0) + 1);
      }
      else {
        for (const cat of filtered) {
          map.set(cat, (map.get(cat) ?? 0) + 1);
        }
      }
    }
    else if (content.category === 'undefined' || content.category === undefined) {
      map.set('undefined', (map.get('undefined') ?? 0) + 1);
    }
    else if (typeof content.category === 'string') {
      map.set(content.category, (map.get(content.category) ?? 0) + 1);
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
