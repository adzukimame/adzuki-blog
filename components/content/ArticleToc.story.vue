<template>
  <Story>
    <Variant
      title="default"
      :meta="{
        shotParams: {
          click: 'summary',
        },
      }">
      <ArticleToc v-bind="defaultData" />
    </Variant>
    <Variant title="UndefinedToc">
      <ArticleToc v-bind="tocUndefinedtData" />
    </Variant>
    <Variant title="EmptyToc">
      <ArticleToc v-bind="tocEmptytData" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import ArticleToc from './ArticleToc.vue';

const defaultData: InstanceType<typeof ArticleToc>['$props'] = {
  toc: {
    depth: 0,
    searchDepth: 2,
    title: '目次',
    links: [
      {
        id: 'heading1',
        text: '見出し1',
        depth: 1,
        children: [
          {
            id: 'heading2',
            text: '小見出し2',
            depth: 2,
          },
          {
            id: 'heading3',
            text: '小見出し3',
            depth: 2,
          },
        ],
      },
      {
        id: 'heading4',
        text: '見出し4',
        depth: 1,
      },
    ],
  },
};
const tocUndefinedtData: InstanceType<typeof ArticleToc>['$props'] = { toc: undefined };
const tocEmptytData: InstanceType<typeof ArticleToc>['$props'] = {
  toc: {
    depth: 0,
    searchDepth: 2,
    title: '目次',
    links: [],
  },
};
</script>
