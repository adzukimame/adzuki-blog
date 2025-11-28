<template>
  <Story id="ArticleList">
    <ArticleList :articles="articles" />
  </Story>
</template>

<script setup lang="ts">
import ArticleList from './ArticleList.vue';

type props = InstanceType<typeof ArticleList>['$props'];

const articles: props['articles'] = [
  { id: 'id1', path: 'path1', title: 'A Title', description: 'a description', category: ['typescript'], created: '2000-01-01' },
  { id: 'id2', path: 'path2', title: 'A Title', description: 'a description', category: [], created: null },
];
</script>
