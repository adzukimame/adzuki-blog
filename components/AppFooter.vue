<template>
  <footer :class="$style.footer">
    <div :class="$style.copyright">
      Copyright © {{ new Date().getFullYear() }} {{ appConfig.authorName }}. All Rights Reserved.
    </div>
  </footer>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
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
