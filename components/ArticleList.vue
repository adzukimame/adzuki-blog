<template>
  <div>
    <div v-if="articles && articles.length > 0"
         class="articleList">
      <ArticleListItem v-for="item in articles"
                       :key="item._id"
                       :item="item" />
    </div>
    <div v-else
         class="articleNotFound">
      コンテンツはありません
    </div>
  </div>
</template>

<script setup lang="ts">
import ArticleListItem from './ArticleListItem.vue';

defineProps<{
  articles: InstanceType<typeof ArticleListItem>['$props']['item'][] | null;
}>();
</script>

<style scoped>
.articleList {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
</style>
