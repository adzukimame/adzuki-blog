<template>
  <Story
    id="ArticleListItem"
    :meta="{
      interact: [
        { operation: [{ hover: 'article' }] },
      ],
    }">
    <Variant title="default">
      <ArticleListItem :item="defaultItem" />
    </Variant>
    <Variant title="missingProperties">
      <ArticleListItem :item="missingPropertiesItem" />
    </Variant>
    <Variant title="longProperties">
      <ArticleListItem :item="longPropertiesItem" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ArticleListItem from './ArticleListItem.vue';

type Item = InstanceType<typeof ArticleListItem>['$props']['item'];

const defaultItem: Item = { _id: 'id1', _path: 'path1', title: 'A Title', description: 'a description', category: ['typescript'], created: '2000-01-01' };

const missingPropertiesItem: Item = { _id: 'id1', _path: 'path1', title: 'A Title', description: 'a description', category: undefined, created: undefined };

const longPropertiesItem: Item = {
  _id: 'id1',
  _path: 'path1',
  title: 'あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。　あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。　あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。',
  description: 'あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。　あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。　あのイーハトーヴォのすきとおった風、夏でも底に冷たさをもつ青いそら、うつくしい森で飾られたモリーオ市、郊外のぎらぎらひかる草の波。',
  category: ['Lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipiscing', 'elit,', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua.', 'Ut', 'enim', 'ad', 'minim', 'veniam,', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat.', 'Duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur.', 'Excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident,', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'],
  created: '2000-01-01',
};
</script>
