<template>
  <div>
    <div v-if="category"
         :class="$style.categoryName">
      カテゴリ「{{ category }}」の投稿
    </div>
    <div v-else
         :class="$style.categoryName">
      すべての投稿
    </div>
    <main ref="articleListOuter">
      <ArticleList :articles="articles" />
    </main>
    <PageNavigator :current-page-number="pageNumber"
                   :items-length="articleCount ?? 0"
                   :items-per-page="ARTICLE_PER_PAGE"
                   page-query-param="p"
                   :class="$style.navigator" />
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();

const route = useRoute();

const ARTICLE_PER_PAGE = 12;

const category = computed(() => Array.isArray(route.params.name) ? route.params.name[0] : route.params.name);

const { data: articleCount } = await useAsyncData(
  `articleCount:/category/${category.value}`,
  () => {
    const query = queryContent('posts');

    if (category.value !== undefined) {
      query.where({ category: category.value });
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

    articleListOuter.value!.animate([
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

    if (category.value !== undefined) {
      query.where({ category: category.value });
    }

    return query
      .sort({ _id: -1 })
      .skip((pageNumberForDisplay.value - 1) * ARTICLE_PER_PAGE)
      .limit(ARTICLE_PER_PAGE)
      .only(['_id', '_path', 'title', 'description', 'category', 'created'])
      .find();
  },
  {
    watch: [category, pageNumberForDisplay],
  }
);

useHead({
  title: category.value === undefined ? 'すべての投稿' : `カテゴリ「${category.value}」の投稿`,
});

useServerSeoMeta({
  ogTitle: `${category.value === undefined ? 'すべての投稿' : `カテゴリ「${category.value}」の投稿`} - ${appConfig.siteName}`,
  ogDescription: `${category.value === undefined ? 'すべての投稿' : `カテゴリ「${category.value}」の投稿`} - ${appConfig.siteName}`,
});

useSeoMeta({
  description: `${category.value === undefined ? 'すべての投稿' : `カテゴリ「${category.value}」の投稿`} - ${appConfig.siteName}`,
});
</script>

<style module>
.categoryName {
  font-size: 1.2rem;
  padding-block-end: 0.4rem;
  border-block-end: solid 2px var(--split);
  margin-block-end: 2rem;
}

.navigator {
  margin-block: 2rem;
}
</style>
