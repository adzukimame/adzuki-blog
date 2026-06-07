<template>
  <footer class="flex flex-col block-footer-block border-bs border-split justify-center">
    <div class="ps-15 text-[0.8rem] text-fg-weak">
      Copyright © {{ new Date().getFullYear() }} {{ runtimeConfig.public.authorName }}. All Rights Reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>
