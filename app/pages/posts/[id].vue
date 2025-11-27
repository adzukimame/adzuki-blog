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

const id = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  if (id === undefined) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }
  return id;
});

const { data } = await useAsyncData(
  `content:/posts/${id.value}`,
  () => queryCollection('posts')
    .where('path', '=', `/posts/${id.value}`)
    .first(),
  {
    watch: [id],
    transform: (content) => {
      if (content === null) return null;

      const tocEnabled = (content.body.toc?.links.length ?? -1) > 1;
      const h1Index = tocEnabled ? content.body.value.findIndex(node => typeof node !== 'string' && node[0] === 'h1') : -1;
      const h2Index = tocEnabled ? content.body.value.findIndex(node => typeof node !== 'string' && node[0] === 'h2') : -1;

      if (h1Index !== -1 && h2Index !== -1 && content.body.toc !== undefined) {
        content.body.value.splice(h2Index, 0, [
          'article-toc',
          {
            toc: content.body.toc,
          },
        ]);
      }

      return content;
    },
  }
);

const requestUrl = useRequestURL();

if ((import.meta.server && requestUrl.origin === runtimeConfig.public.origin) || import.meta.dev) {
  const robots = [
    'nofollow', 'noarchive', 'noimageindex', 'noai', 'noimageai',
    ...(data.value?.allowIndex === true ? [] : ['noindex', 'nosnippet']),
  ].join(', ');
  useSeoMeta({ robots });
}

if (data.value) {
  useHead({
    title: data.value.title,
  });

  if (import.meta.server) {
    useSeoMeta({
      ogTitle: `${data.value.title} - ${runtimeConfig.public.siteName}`,
      ogDescription: typeof data.value.description === 'string' ? data.value.description.replace(/^\s+/, '') : undefined,
    });
  }

  useSeoMeta({
    description: () => (typeof data.value?.description === 'string' ? data.value.description.replace(/^\s+/, '') : undefined),
  });
}
else {
  const event = useRequestEvent();
  if (event) {
    setResponseStatus(event, 404);
  }
}
</script>
