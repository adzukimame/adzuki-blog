<!-- https://github.com/nuxt-modules/mdc/blob/44fef672139208dc1b53442cebc97bd98e5684a7/src/runtime/components/prose/ProseA.vue -->

<template>
  <NuxtLink
    :href="props.href"
    :target="runtimeConfig.public.origin === urlObj.origin ? props.target : '_blank'">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  target: {
    // eslint-disable-next-line -- 参照元のコードがこうなっている
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: undefined,
    required: false,
  },
});

const runtimeConfig = useRuntimeConfig();
const urlObj = computed(() => new URL(props.href, runtimeConfig.public.origin));
</script>
