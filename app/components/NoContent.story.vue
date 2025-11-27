<template>
  <Story id="NoContent">
    <Variant title="default">
      <NoContent />
    </Variant>
    <Variant title="showBackButton">
      <NoContent :show-back-button="true" />
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import NoContent from './NoContent.vue';
</script>
