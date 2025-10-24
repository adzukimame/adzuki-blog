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
useServerHead({
  script: [
    {
      textContent: `(()=>{try{const a=window.localStorage.getItem("colorScheme");"dark"===a?(document.documentElement.dataset.colorScheme="dark"):null===a&&window.matchMedia("(prefers-color-scheme: dark)").matches&&(document.documentElement.dataset.colorScheme="dark")}catch{window.matchMedia("(prefers-color-scheme: dark)").matches&&(document.documentElement.dataset.colorScheme="dark")}})();`,
    },
  ],
});

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
useServerHead({
  script: [
    {
      textContent: `(()=>{const a=new URLSearchParams(location.search).get("tategaki");try{const b=window.localStorage.getItem("writingMode");document.documentElement.dataset.writingMode=(a==="false"||b==="horizontal-tb"||b===null)?"horizontal-tb":"vertical-rl"}catch{document.documentElement.dataset.writingMode=a==="false"?"horizontal-tb":"vertical-rl"}})();`,
    },
  ],
});

const writingMode = useWritingMode();

const handleWheel = (event: WheelEvent): void => {
  if (event.target instanceof Element && getComputedStyle(event.target).writingMode === 'horizontal-tb') {
    const preElem = event.target.tagName === 'PRE'
      ? event.target
      : event.target.tagName === 'CODE' && event.target.parentElement?.tagName === 'PRE'
        ? event.target.parentElement
        : event.target.tagName === 'SPAN' && event.target.classList.contains('line') && event.target.parentElement?.tagName === 'CODE' && event.target.parentElement.parentElement?.tagName === 'PRE'
          ? event.target.parentElement.parentElement
          : event.target.tagName === 'SPAN' && event.target.parentElement?.tagName === 'SPAN' && event.target.parentElement.classList.contains('line') && event.target.parentElement.parentElement?.tagName === 'CODE' && event.target.parentElement.parentElement.parentElement?.tagName === 'PRE'
            ? event.target.parentElement.parentElement.parentElement
            : null;

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

onMounted(() => {
  initReactiveWritingMode();

  watch(writingMode, (newMode) => {
    if (newMode === 'vertical-rl') {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }
    else {
      window.removeEventListener('wheel', handleWheel);
    }
  }, { immediate: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('wheel', handleWheel);
});
// end - 縦組み

// analytics script
const runtimeConfig = useRuntimeConfig();

if (!import.meta.dev && runtimeConfig.public.cfWebAnalyticsToken) {
  useServerHead({
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
useServerHead({
  htmlAttrs: {
    lang: 'ja-JP',
  },
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
});

useHead({
  titleTemplate: titleChunk => titleChunk !== undefined && titleChunk.length > 0 ? `${titleChunk} - ${runtimeConfig.public.siteName}` : runtimeConfig.public.siteName,
});

useServerSeoMeta({
  robots: 'noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai',
  referrer: 'same-origin',
  twitterCard: 'summary',
  ogTitle: runtimeConfig.public.siteName,
  ogDescription: runtimeConfig.public.siteDescription,
});

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
