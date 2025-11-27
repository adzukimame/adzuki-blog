<template>
  <Html
    :class="[{ dark: colorScheme === 'dark' }, { light: colorScheme === 'light' }]"
    :data-color-scheme="colorScheme === 'dark' ? 'dark' : null"
    :data-writing-mode="writingMode" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// color scheme

// add class before hydration to avoid blink
if (import.meta.server) {
  useHead({
    script: [
      {
        textContent: `(()=>{try{const a=window.localStorage.getItem("colorScheme");"dark"===a?(document.documentElement.dataset.colorScheme="dark"):null===a&&window.matchMedia("(prefers-color-scheme: dark)").matches&&(document.documentElement.dataset.colorScheme="dark")}catch{window.matchMedia("(prefers-color-scheme: dark)").matches&&(document.documentElement.dataset.colorScheme="dark")}})();`,
      },
    ],
  });
}

const colorScheme = useColorScheme();

onMounted(() => {
  initReactiveColorScheme();

  window.matchMedia('(prefers-color-scheme: light)').addEventListener(
    'change',
    preferredColorSchemeChangeListener
  );
});
// end - color scheme

// 縦組み
if (import.meta.server) {
  useHead({
    script: [
      {
        textContent: `(()=>{const a=new URLSearchParams(location.search).get("tategaki");try{const b=window.localStorage.getItem("writingMode");document.documentElement.dataset.writingMode=(a==="false"||b==="horizontal-tb"||b===null)?"horizontal-tb":"vertical-rl"}catch{document.documentElement.dataset.writingMode=a==="false"?"horizontal-tb":"vertical-rl"}})();`,
      },
    ],
  });
}

const writingMode = useWritingMode();

const getPreElem = (target: Element): Element | null => {
  if (target.tagName === 'PRE') {
    return target;
  }
  if (target.tagName === 'CODE' && target.parentElement?.tagName === 'PRE') {
    return target.parentElement;
  }
  if (target.tagName === 'SPAN' && target.classList.contains('line') && target.parentElement?.tagName === 'CODE' && target.parentElement.parentElement?.tagName === 'PRE') {
    return target.parentElement.parentElement;
  }
  if (target.tagName === 'SPAN' && target.parentElement?.tagName === 'SPAN' && target.parentElement.classList.contains('line') && target.parentElement.parentElement?.tagName === 'CODE' && target.parentElement.parentElement.parentElement?.tagName === 'PRE') {
    return target.parentElement.parentElement.parentElement;
  }
  return null;
};

const handleWheel = (event: WheelEvent): void => {
  if (event.target instanceof Element && getComputedStyle(event.target).writingMode === 'horizontal-tb') {
    const preElem = getPreElem(event.target);

    if (preElem && event.shiftKey) {
      event.preventDefault();
      return;
    }
    else if (preElem && preElem.scrollHeight > preElem.clientHeight) {
      return;
    }
  }

  if (!event.shiftKey && event.deltaY !== 0) {
    event.preventDefault();
    window.scrollBy(-event.deltaY, 0);
  }
  else if (event.shiftKey && event.deltaY !== 0) {
    event.preventDefault();
    window.scrollBy(0, event.deltaY);
  }
};

let touchStartY = 0;
let touchStartX = 0;
let touchStartScrollTop = 0;

const handleTouchStart = (event: TouchEvent): void => {
  if (event.target instanceof Element && getComputedStyle(event.target).writingMode === 'horizontal-tb') {
    const preElem = getPreElem(event.target);
    if (preElem && preElem.scrollHeight > preElem.clientHeight) {
      touchStartY = event.touches[0]?.clientY ?? 0;
      touchStartX = event.touches[0]?.clientX ?? 0;
      touchStartScrollTop = preElem.scrollTop;
    }
  }
};

const handleTouchMove = (event: TouchEvent): void => {
  if (event.target instanceof Element && getComputedStyle(event.target).writingMode === 'horizontal-tb') {
    const preElem = getPreElem(event.target);
    if (preElem && preElem.scrollHeight > preElem.clientHeight) {
      const touch = event.touches[0];
      if (touch) {
        const deltaY = touchStartY - touch.clientY;
        const deltaX = Math.abs(touchStartX - touch.clientX);

        if (Math.abs(deltaY) > deltaX) {
          event.preventDefault();
          preElem.scrollTop = touchStartScrollTop + deltaY;
          return;
        }
      }
    }
  }
};

onMounted(() => {
  initReactiveWritingMode();

  watch(writingMode, (newMode) => {
    if (newMode === 'vertical-rl') {
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('touchstart', handleTouchStart, { passive: false });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
    }
    else {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    }
  }, { immediate: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('touchstart', handleTouchStart);
  window.removeEventListener('touchmove', handleTouchMove);
});
// end - 縦組み

// analytics script
const runtimeConfig = useRuntimeConfig();

if (!import.meta.dev && import.meta.server && runtimeConfig.public.cfWebAnalyticsToken) {
  useHead({
    script: [
      {
        'defer': true,
        'src': 'https://static.cloudflareinsights.com/beacon.min.js',
        'data-cf-beacon': JSON.stringify({ token: runtimeConfig.public.cfWebAnalyticsToken }),
        'tagPosition': 'bodyClose',
      },
    ],
  });
}
// end - analytics script

// metas
if (import.meta.server) {
  useHead({
    htmlAttrs: {
      lang: 'ja-JP',
    },
    link: [
      { rel: 'icon', href: '/favicon.ico' },
    ],
  });
}

useHead({
  titleTemplate: titleChunk => titleChunk !== undefined && titleChunk.length > 0 ? `${titleChunk} - ${runtimeConfig.public.siteName}` : runtimeConfig.public.siteName,
});

if (import.meta.server) {
  useSeoMeta({
    robots: 'noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai',
    referrer: 'same-origin',
    twitterCard: 'summary',
    ogTitle: runtimeConfig.public.siteName,
    ogDescription: runtimeConfig.public.siteDescription,
  });
}

useSeoMeta({
  description: runtimeConfig.public.siteDescription,
});
// end - metas
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity var(--page-trans-dur) var(--page-trans-func), filter var(--page-trans-dur) var(--page-trans-func);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(4px);
}
</style>
