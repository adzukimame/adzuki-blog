<template>
  <div>
    <div class="category-name">
      カテゴリ「{{ category === 'undefined' ? '未設定' : category }}」の投稿
    </div>
    <main ref="articleListOuter">
      <ArticleList :articles="articles" />
    </main>
    <PageNavigator
      :current-page-number="pageNumber"
      :items-length="articleCount ?? 0"
      :items-per-page="ARTICLE_PER_PAGE"
      page-query-param="p"
      class="navigator" />
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();

const route = useRoute();

const ARTICLE_PER_PAGE = 10;

const category = computed(() => {
  const category = Array.isArray(route.params.name) ? route.params.name[0] : route.params.name;
  if (category === undefined) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }
  return category;
});

const { data: articleCount } = await useAsyncData(
  `articleCount:/category/${category.value}`,
  () => {
    const query = queryContent('posts');

    if (category.value === 'undefined') {
      query.where({
        $or: [{ category: { $exists: false } }, { category: 'undefined' }],
      });
    }
    else {
      query.where({
        $or: [{ category: category.value }, { category: { $contains: category.value } }],
      });
    }

    return query.count();
  },
  {
    watch: [category],
  }
);

const pageNumber = computed(() => {
  const param = (Array.isArray(route.query.p) ? route.query.p[0] : route.query.p) ?? 1;

  if (param === 1) {
    return 1;
  }

  const parsed = parseInt(param);

  return Number.isNaN(parsed) ? 1 : parsed;
});

const pageNumberForDisplay = ref(pageNumber.value);
const articleListOuter = ref<HTMLElement | null>(null);

watch(pageNumber, (newPageNumber) => {
  const anim = articleListOuter.value?.animate([
    { opacity: 1 },
    { opacity: 0, filter: 'blur(4px)' },
  ], {
    duration: appConfig.pageTransitionDuration,
    easing: appConfig.pageTransitionFunction,
  });

  anim?.addEventListener('finish', () => {
    pageNumberForDisplay.value = newPageNumber;

    articleListOuter.value?.animate([
      { opacity: 0, filter: 'blur(4px)' },
      { opacity: 1 },
    ], {
      duration: appConfig.pageTransitionDuration,
      easing: appConfig.pageTransitionFunction,
    });
  });
});

const { data: articles } = await useAsyncData(
  `category:/category/${category.value}`,
  () => {
    const query = queryContent('posts');

    if (category.value === 'undefined') {
      query.where({
        $or: [{ category: { $exists: false } }, { category: 'undefined' }],
      });
    }
    else {
      query.where({
        $or: [{ category: category.value }, { category: { $contains: category.value } }],
      });
    }

    return query
      .sort({ _id: -1, created: -1 })
      .skip((pageNumberForDisplay.value - 1) * ARTICLE_PER_PAGE)
      .limit(ARTICLE_PER_PAGE)
      .only(['_id', '_path', 'title', 'description', 'category', 'created', 'hideDescription'])
      .find();
  },
  {
    watch: [category, pageNumberForDisplay],
  }
);

useHead({
  title: `カテゴリ「${category.value === 'undefined' ? '未設定' : category.value}」の投稿`,
});

useServerSeoMeta({
  ogTitle: `カテゴリ「${category.value === 'undefined' ? '未設定' : category.value}」の投稿 - ${runtimeConfig.public.siteName}`,
  ogDescription: `カテゴリ「${category.value === 'undefined' ? '未設定' : category.value}」の投稿 - ${runtimeConfig.public.siteName}`,
});

useSeoMeta({
  description: `カテゴリ「${category.value === 'undefined' ? '未設定' : category.value}」の投稿 - ${runtimeConfig.public.siteName}`,
});
</script>

<style scoped>
.category-name {
  font-size: 1.2rem;
  padding-block-end: 0.4rem;
  border-block-end: solid 2px var(--split);
  margin-block-end: 2rem;
}

.navigator {
  margin-block: 2rem;
}
</style>
