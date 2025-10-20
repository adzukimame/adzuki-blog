<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true">
    <path d="M9 6l6 6l-6 6" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: string;
  strokeWidth?: number;
}>(), {
  size: '1rem',
  strokeWidth: 2,
});
</script>
