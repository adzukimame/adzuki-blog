<template>
  <Story id="ArticleList">
    <ArticleList :articles="articles" />
  </Story>
</template>

<script setup lang="ts">
import ArticleList from './ArticleList.vue';

type props = InstanceType<typeof ArticleList>['$props'];

const articles: props['articles'] = [
  { _id: 'id1', _path: 'path1', title: 'A Title', description: 'a description', category: ['typescript'], created: '2000-01-01' },
  { _id: 'id2', _path: 'path2', title: 'A Title', description: 'a description', category: undefined, created: undefined },
];
</script>
