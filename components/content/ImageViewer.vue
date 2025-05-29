<!-- https://github.com/nuxt-modules/mdc/blob/44fef672139208dc1b53442cebc97bd98e5684a7/src/runtime/components/prose/ProseImg.vue -->

<template>
  <div class="image-viewer container"
       @click="openModal">
    <component :is="ImageComponent"
               :src="refinedSrc"
               :alt="alt"
               :width="width"
               :height="height"
               class="image"
               data-testid="image" />
  </div>
  <Teleport to="body">
    <div v-if="modalOpened"
         ref="modalContainerEl"
         class="modal-container"
         data-testid="modal-container"
         @click="closeModal">
      <component :is="ImageComponent"
                 :src="refinedSrc"
                 :alt="alt"
                 :width="width"
                 :height="height"
                 class="modal-image" />
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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

<style scoped>
.container {
  display: block flex;
  margin-inline: auto;
  inline-size: 100%;
  aspect-ratio: 16 / 9;
  justify-content: center;
  border: solid 3px var(--split);
  background-image: radial-gradient(var(--split) 2px, transparent 2px);
  background-size: 28px 28px;
  cursor: zoom-in;
}

.image {
  aspect-ratio: 16 / 9;
}

@media (min-width: 769px) {
  .container {
    inline-size: 80%;
  }
}

:root.writing-mode-vertical-rl .container {
  aspect-ratio: 9 / 16;
}

:root.writing-mode-vertical-rl .image {
  aspect-ratio: 9 / 16;
}

.modal-container {
  display: block flex;
  position: fixed;
  inset: 0;
  background-color: color-mix(in srgb, var(--bg) 70%, transparent);
}

.modal-image {
  margin: auto;
  cursor: zoom-out;
}
</style>
