<template>
  <main>
    <ArticleRenderer :content="data ?? undefined" />
  </main>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const route = useRoute();

const name = computed(() => Array.isArray(route.params.name) ? route.params.name[0] : route.params.name);

const { data } = await useAsyncData(
  `content:/pages/${name.value}`,
  () => queryContent('pages')
    .where({
      _path: `/pages/${name.value}`,
    })
    .findOne(),
  {
    watch: [name],
  }
);

if (data.value) {
  useHead({
    title: data.value.title,
  });

  useServerSeoMeta({
    ogTitle: `${data.value.title ?? name.value} - ${runtimeConfig.public.siteName}`,
    ogDescription: `${data.value.title ?? name.value} - ${runtimeConfig.public.siteName}`,
  });

  useSeoMeta({
    description: `${data.value.title ?? name.value} - ${runtimeConfig.public.siteName}`,
  });
}
else {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}
</script>
