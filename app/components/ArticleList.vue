<template>
  <div>
    <div
      v-if="articles && articles.length > 0"
      class="flex flex-col gap-12">
      <ArticleListItem
        v-for="item in articles"
        :key="item.id"
        :item="item" />
    </div>
    <div v-else>
      コンテンツはありません
    </div>
  </div>
</template>

<script setup lang="ts">
import ArticleListItem from './ArticleListItem.vue';

defineProps<{
  articles: InstanceType<typeof ArticleListItem>['$props']['item'][] | null | undefined;
}>();
</script>
