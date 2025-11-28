<template>
  <main>
    <ArticleRenderer
      v-if="data != null"
      :content="data" />
    <NoContent
      v-else
      :show-back-button="true" />
  </main>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();

const route = useRoute();

const name = computed(() => {
  const name = Array.isArray(route.params.name) ? route.params.name[0] : route.params.name;
  if (name === undefined) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }
  return name;
});

const { data } = await useAsyncData(
  `content:/pages/${name.value}`,
  () => queryCollection('pages')
    .where('path', '=', `/pages/${name.value}`)
    .first(),
  {
    watch: [name],
  }
);

if (data.value) {
  useHead({
    title: data.value.title,
  });

  if (import.meta.server) {
    useSeoMeta({
      ogTitle: `${data.value.title} - ${runtimeConfig.public.siteName}`,
      ogDescription: `${data.value.title} - ${runtimeConfig.public.siteName}`,
    });
  }

  useSeoMeta({
    description: () => `${data.value?.title ?? name.value} - ${runtimeConfig.public.siteName}`,
  });
}
else {
  const event = useRequestEvent();
  if (event) {
    setResponseStatus(event, 404);
  }
}
</script>
