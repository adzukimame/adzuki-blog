<template>
  <div>
    <div class="text-[1.2rem] pbe-4 border-be-2 border-split mbe-20">
      すべての投稿
    </div>
    <main ref="articleListOuter">
      <ArticleList :articles="articles" />
    </main>
    <PageNavigator
      :current-page-number="pageNumber"
      :items-length="articleCount ?? 0"
      :items-per-page="ARTICLE_PER_PAGE"
      page-query-param="p"
      class="my-20" />
  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();

const route = useRoute();

const ARTICLE_PER_PAGE = 10;

const { data: articleCount } = await useAsyncData(
  () => queryCollection('posts').count()
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
  () => queryCollection('posts')
    .order('created', 'DESC')
    .order('id', 'DESC')
    .skip((pageNumberForDisplay.value - 1) * ARTICLE_PER_PAGE)
    .limit(ARTICLE_PER_PAGE)
    .select('id', 'path', 'title', 'description', 'category', 'created')
    .all(),
  {
    watch: [pageNumberForDisplay],
  }
);

if (import.meta.server) {
  useHead({
    link: runtimeConfig.public.authorSocialLinks.filter(link => typeof link === 'string').map(link => ({ rel: 'me', href: link })),
  });
}

useHead({
  title: '',
});

const requestUrl = useRequestURL();

if ((import.meta.server && requestUrl.origin === runtimeConfig.public.origin) || import.meta.dev) {
  useSeoMeta({
    robots: 'noarchive, noimageindex, noai, noimageai',
  });
}

if (import.meta.server) {
  useSeoMeta({
    ogTitle: runtimeConfig.public.siteName,
    ogDescription: runtimeConfig.public.siteDescription,
  });
}

useSeoMeta({
  description: runtimeConfig.public.siteDescription,
});
</script>
