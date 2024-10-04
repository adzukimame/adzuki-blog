<template>
  <main>
    <ArticleRenderer :content="data ?? undefined" />
  </main>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();

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
    ogTitle: `${data.value.title} - ${appConfig.siteName}`,
    ogDescription: `${data.value.title} - ${appConfig.siteName}`,
  });

  useSeoMeta({
    description: `${data.value.title} - ${appConfig.siteName}`,
  });
}
</script>
