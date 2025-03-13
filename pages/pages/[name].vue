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
    ogTitle: `${data.value.title} - ${runtimeConfig.public.siteName}`,
    ogDescription: `${data.value.title} - ${runtimeConfig.public.siteName}`,
  });

  useSeoMeta({
    description: `${data.value.title} - ${runtimeConfig.public.siteName}`,
  });
}
</script>
