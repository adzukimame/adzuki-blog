<template>
  <main>
    <ArticleRenderer :content="data ?? undefined" />
  </main>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();

const route = useRoute();

const id = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);

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
      const h1Index = tocEnabled ? content.body!.children.findIndex(node => node.type === 'element' && node.tag === 'h1') : -1;
      const h2Index = tocEnabled ? content.body!.children.findIndex(node => node.type === 'element' && node.tag === 'h2') : -1;

      if (h1Index !== -1 && h2Index !== -1) {
        content.body!.children.splice(h2Index, 0, {
          type: 'element',
          tag: 'article-toc',
          props: {
            toc: content.body!.toc!,
          },
          children: [],
        });
      }

      return content;
    },
  }
);

if (data.value) {
  useHead({
    title: data.value.title,
  });

  useSeoMeta({
    ogTitle: `${data.value.title} - ${appConfig.siteName}`,
    description: `${data.value.title} - ${appConfig.siteName}`,
    ogDescription: `${data.value.title} - ${appConfig.siteName}`,
  });
}
</script>
