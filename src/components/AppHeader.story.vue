<template>
  <Story
    id="AppHeader"
    :meta="{
      interact: [
        {
          operation: [{ click: '[aria-label=\'メニューを開く\']' }],
          condition: { smallScreen: true },
        },
        {
          operation: [
            { click: '[aria-label=\'メニューを開く\']' },
            { hover: 'nav ul>li:first-child' },
          ],
          condition: { smallScreen: true },
        },
        {
          operation: [{ hover: '[aria-label=\'ダークモードに切り替える\']' }],
          condition: { darkMode: false },
        },
        {
          operation: [{ click: '[aria-label=\'ダークモードに切り替える\']' }],
          condition: { darkMode: false },
        },
      ],
    }">
    <AppHeader />
  </Story>
</template>

<script setup lang="ts">
</script>
