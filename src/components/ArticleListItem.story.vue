<template>
  <Story>
    <Variant
      title="default"
      :meta="{
        interact: [
          [{ hover: 'article' }],
        ],
      }">
      <ArticleListItem v-bind="defaultData" />
    </Variant>
    <Variant title="MissingProperties">
      <ArticleListItem v-bind="missingPropertiesData" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ArticleListItem from './ArticleListItem.vue';

const defaultData: InstanceType<typeof ArticleListItem>['$props'] = {
  item: { _id: 'id1', _path: 'path1', title: 'A Title', description: 'a description', category: ['typescript'], created: '2000-01-01' },
};

const missingPropertiesData: InstanceType<typeof ArticleListItem>['$props'] = {
  item: { _id: 'id1', _path: 'path1', title: 'A Title', description: 'a description', category: undefined, created: undefined },
};
</script>
