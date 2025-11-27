<!-- https://github.com/nuxt/nuxt/blob/v3.18.0/packages/nuxt/src/app/components/nuxt-loading-indicator.ts -->

<template>
  <div
    :class="[$style.loadingIndicator, { [$style.verticalLayout]: verticalLayout }]"
    :style="{
      height: `${$props.height}px`,
      opacity: isLoading ? '1' : '0',
      background,
      backgroundSize: `${(100 / progress) * 100}% auto`,
      transform: `scaleX(${progress}%)`,
    }" />
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  throttle?: number;
  duration?: number;
  hideDelay?: number;
  resetDelay?: number;
  height?: number;
  color?: string;
  verticalLayoutColor?: string;
  errorColor?: string;
  estimatedProgress?: (duration: number, elapsed: number) => number;
}>(), {
  throttle: 200,
  duration: 2000,
  hideDelay: 500,
  resetDelay: 400,
  height: 3,
  color: 'repeating-linear-gradient(to right, color-mix(in oklch, var(--accent) 80%, transparent) 0%, color-mix(in oklch, var(--accent) 80%, transparent) 85%, color-mix(in oklch, var(--accent) 30%, transparent) 100%)',
  verticalLayoutColor: 'repeating-linear-gradient(to left, color-mix(in oklch, var(--accent) 80%, transparent) 0%, color-mix(in oklch, var(--accent) 80%, transparent) 85%, color-mix(in oklch, var(--accent) 30%, transparent) 100%)',
  errorColor: 'oklch(0.5933 0.1677 20.96)',
});

const writingMode = useWritingMode();
const verticalLayout = computed(() => writingMode.value === 'vertical-rl');

const { progress, isLoading, error } = useLoadingIndicator({
  duration: props.duration,
  throttle: props.throttle,
  hideDelay: props.hideDelay,
  resetDelay: props.resetDelay,
  estimatedProgress: props.estimatedProgress,
});

const background = computed(() => error.value ? props.errorColor : verticalLayout.value ? props.verticalLayoutColor : props.color);
</script>

<style module>
.loadingIndicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  width: auto;
  transform-origin: left;
  transition: transform 0.1s, height 0.4s, opacity 0.4s;
  z-index: 999999;

  &.verticalLayout {
    transform-origin: right;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 0 !important;
  }
}
</style>
