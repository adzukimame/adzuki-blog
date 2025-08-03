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
  () => queryContent('posts')
    .where({
      _path: `/posts/${id.value}`,
    })
    .findOne(),
  {
    watch: [id],
    transform: (content) => {
      const tocEnabled = (content.body?.toc?.links.length ?? -1) > 1;
      const h1Index = tocEnabled ? content.body?.children.findIndex(node => node.type === 'element' && node.tag === 'h1') ?? -1 : -1;
      const h2Index = tocEnabled ? content.body?.children.findIndex(node => node.type === 'element' && node.tag === 'h2') ?? -1 : -1;

      if (h1Index !== -1 && h2Index !== -1 && content.body?.toc !== undefined) {
        content.body.children.splice(h2Index, 0, {
          type: 'element',
          tag: 'article-toc',
          props: {
            toc: content.body.toc,
          },
          children: [],
        });
      }

      return content;
    },
  }
);

const requestUrl = useRequestURL();

if (requestUrl.origin === runtimeConfig.public.origin || import.meta.dev) {
  const robots = [
    'nofollow', 'noarchive', 'noimageindex', 'noai', 'noimageai',
    ...(data.value?.allowIndex === true ? [] : ['noindex', 'nosnippet']),
  ].join(', ');
  useServerSeoMeta({ robots });
}

if (data.value) {
  useHead({
    title: data.value.title,
  });

  useServerSeoMeta({
    ogTitle: `${data.value.title ?? id.value} - ${runtimeConfig.public.siteName}`,
    ogDescription: typeof data.value.description === 'string' ? data.value.description.replace(/^\s+/, '') : undefined,
  });

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
