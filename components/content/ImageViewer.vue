<!-- https://github.com/nuxt-modules/mdc/blob/b89db73a82624760cd6fa5b85ede263b95ff157e/src/runtime/components/prose/ProseImg.vue -->

<template>
  <div class="imageViewer"
       :class="$style.container"
       @click="openModal">
    <component :is="imgComponent"
               :src="refinedSrc"
               :alt="alt"
               :width="width"
               :height="height"
               :class="$style.image" />
  </div>
  <Teleport to="body">
    <div v-if="modalOpened"
         ref="modalContainerEl"
         :class="$style.modalContainer"
         @click="closeModal">
      <component :is="imgComponent"
                 :src="refinedSrc"
                 :alt="alt"
                 :width="width"
                 :height="height"
                 :class="$style.modalImage" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { withTrailingSlash, withLeadingSlash, joinURL } from 'ufo';
import { useRuntimeConfig, computed, resolveComponent } from '#imports';

const appConfig = useAppConfig();

const imgComponent = useRuntimeConfig().public.mdc.useNuxtImage ? resolveComponent('NuxtImg') : 'img';

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

<style module>
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

:root:global(.writing-mode-vertical-rl) .container {
  aspect-ratio: 9 / 16;
}

:root:global(.writing-mode-vertical-rl) .image {
  aspect-ratio: 9 / 16;
}

.modalContainer {
  display: block flex;
  position: fixed;
  inset: 0;
  background-color: color-mix(in srgb, var(--bg) 70%, transparent);
}

.modalImage {
  margin: auto;
  cursor: zoom-out;
}
</style>
