<!-- https://github.com/nuxt-modules/mdc/blob/44fef672139208dc1b53442cebc97bd98e5684a7/src/runtime/components/prose/ProseImg.vue -->

<template>
  <div
    class="image-viewer flex mx-auto justify-center border-[3px] border-split bg-[radial-gradient(var(--split)_2px,transparent_2px)] bg-size-[28px_28px] cursor-zoom-in inline-[90%] aspect-video horizontal:max-md:inline-full vertical:aspect-9/16 vertical:max-h-md:inline-full"
    @click="openModal">
    <component
      :is="ImageComponent"
      loading="lazy"
      :src="refinedSrc"
      :alt="alt"
      :width="width"
      :height="height"
      class="aspect-video vertical:aspect-9/16"
      data-testid="image" />
  </div>
  <Teleport to="body">
    <div
      v-if="modalOpened"
      ref="modalContainerEl"
      class="flex fixed inset-0 bg-[color-mix(in_oklch,var(--bg)_80%,transparent)]"
      data-testid="modal-container"
      @click="closeModal">
      <component
        :is="ImageComponent"
        :src="refinedSrc"
        :alt="alt"
        :width="width"
        :height="height"
        class="m-auto cursor-zoom-out" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { withTrailingSlash, withLeadingSlash, joinURL } from 'ufo';
import { useRuntimeConfig, computed } from '#imports';
import ImageComponent from '#build/mdc-image-component.mjs';

const appConfig = useAppConfig();

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
});

const refinedSrc = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- 参照元のコードがこうなっている
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL));
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src);
    }
  }
  return props.src;
});

const modalOpened = ref(false);
const modalContainerEl = ref<HTMLDivElement | null>(null);
let animating = false;

const openModal = () => {
  if (animating || modalOpened.value) {
    return;
  }
  animating = true;

  modalOpened.value = true;

  nextTick(() => {
    const anim = modalContainerEl.value?.animate([
      { opacity: 0 },
      { opacity: 1 },
    ], {
      duration: appConfig.pageTransitionDuration,
      easing: appConfig.pageTransitionFunction,
    });

    anim?.addEventListener('finish', () => {
      animating = false;
    });
  });
};

const closeModal = () => {
  if (animating || !modalOpened.value) {
    return;
  }
  animating = true;

  const anim = modalContainerEl.value?.animate([
    { opacity: 1 },
    { opacity: 0 },
  ], {
    duration: appConfig.pageTransitionDuration,
    easing: appConfig.pageTransitionFunction,
  });

  anim?.addEventListener('finish', () => {
    modalOpened.value = false;
    animating = false;
  });
};
</script>
