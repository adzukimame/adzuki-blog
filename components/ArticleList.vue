<template>
  <div>
    <div v-if="articles && articles.length > 0"
         :class="$style.articleList">
      <ArticleListItem v-for="item in articles"
                       :key="item._id"
                       :item="item" />
    </div>
    <div v-else
         :class="$style.articleNotFound">
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

<style module>
@value articleListItemGap 1.2rem;

.articleList {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: articleListItemGap;
}

@media (max-width: 768px) {
  .articleList {
    display: flex;
    flex-direction: column;
  }
}
</style>
