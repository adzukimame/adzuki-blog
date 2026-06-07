<template>
  <div>
    <div class="text-[1.2rem] pbe-4 border-be-2 border-split mbe-20">
      カテゴリ一覧
    </div>
    <main>
      <ul class="flex flex-col list-none p-0 ps-10 m-0">
        <li
          v-for="item in categoryList"
          :key="item[0]"
          class="before:content-['>'] before:pe-5 before:text-fg-weak">
          <NuxtLink
            class="transition-colors duration-(--duration-hover) ease-(--ease-hover) responsive-hover:text-accent"
            :to="`/category/${item[0]}`">
            {{ `${item[0] === 'undefined' ? '未設定' : item[0]} (${item[1]})` }}
          </NuxtLink>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const { data } = await useAsyncData(() => queryCollection('posts').select('category').all());

const categoryList = computed(() => {
  if (data.value === undefined) {
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

if (import.meta.server) {
  useSeoMeta({
    ogTitle: `カテゴリ一覧 - ${runtimeConfig.public.siteName}`,
    ogDescription: `カテゴリ一覧 - ${runtimeConfig.public.siteName}`,
  });
}

useSeoMeta({
  description: `カテゴリ一覧 - ${runtimeConfig.public.siteName}`,
});
</script>
