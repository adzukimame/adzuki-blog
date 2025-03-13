<template>
  <footer :class="$style.footer">
    <div :class="$style.copyright">
      Copyright © {{ new Date().getFullYear() }} {{ runtimeConfig.public.authorName }}. All Rights Reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
</script>

<style module>
@value footerBorderWidth 1px;

.footer {
  display: block flex;
  flex-direction: column;
  block-size: var(--footerHeight);
  border-block-start: solid var(--split) footerBorderWidth;
  justify-content: center;
}

.copyright {
  display: block;
  padding-inline-start: 1.5rem;
  font-size: 0.8rem;
  color: var(--fgWeak);
}
</style>
