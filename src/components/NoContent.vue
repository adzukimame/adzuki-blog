<template>
  <div :class="$style.container">
    <h2>コンテンツはありません</h2>
    <button
      v-if="$props.showBackButton"
      :class="$style.button"
      @click="$router.back()">
      元のページに戻る
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  showBackButton?: boolean;
}>(), {
  showBackButton: false,
});
</script>

<style module>
.container>:not(:first-child) {
  margin-block-start: 1.8rem;
}

.button {
  color: var(--accent);
  cursor: pointer;
}
</style>
