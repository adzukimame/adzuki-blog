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
    <path d="M7 7l5 5l-5 5" />
    <path d="M13 7l5 5l-5 5" />
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
