<template>
  <div>
    <h2>コンテンツはありません</h2>
    <button
      v-if="$props.showBackButton"
      class="mbs-18 text-accent cursor-pointer"
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
