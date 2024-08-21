<template>
  <Html :class="[{ 'color-scheme-dark': colorScheme === 'dark' }, { 'writing-mode-vertical-rl': writingMode === 'vertical-rl' }]" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// color scheme

// add class before hydration to avoid blink
onPrehydrate(() => {
  const savedColorScheme = window.localStorage.getItem('colorScheme');

  if (savedColorScheme === 'dark'
    || (savedColorScheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('color-scheme-dark');
  }
});

const colorScheme = useColorScheme();

onMounted(() => {
  const savedColorScheme = window.localStorage.getItem('colorScheme');

  if (savedColorScheme === 'light' || savedColorScheme === 'dark') {
    colorScheme.value = savedColorScheme;
  }
  else {
    colorScheme.value = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    window.localStorage.removeItem('colorScheme');
  }

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
    if (window.localStorage.getItem('colorScheme') === null) {
      colorScheme.value = event.matches ? 'light' : 'dark';
    }
  });
});
// end - color scheme

// 縦組み
onPrehydrate(() => {
  const savedWritingMode = window.localStorage.getItem('writingMode');
  const queryWritingMode = new URLSearchParams(location.search).get('tategaki');

  if (queryWritingMode === 'false') {
    window.localStorage.removeItem('writingMode');
  }
  else if (queryWritingMode !== null || savedWritingMode === 'vertical-rl') {
    document.documentElement.classList.add('writing-mode-vertical-rl');
    window.localStorage.setItem('writingMode', 'vertical-rl');
  }
});

const writingMode = useWritingMode();

onMounted(() => {
  const savedWritingMode = window.localStorage.getItem('writingMode');
  writingMode.value = savedWritingMode === 'vertical-rl' ? 'vertical-rl' : null;
});
// end - 縦組み

// analytics script
const runtimeConfig = useRuntimeConfig();

if (!import.meta.dev && runtimeConfig.public.cfWebAnalyticsToken) {
  useServerHead({
    meta: [
      {
        name: 'cf-beacon',
        content: JSON.stringify({ token: runtimeConfig.public.cfWebAnalyticsToken }),
      },
    ],
  });

  onPrehydrate(() => {
    const meta = document.head.querySelector('meta[name="cf-beacon"]');

    if (meta && meta.hasAttribute('content')) {
      const script = document.createElement('script');
      script.setAttribute('defer', '');
      script.setAttribute('src', 'https://static.cloudflareinsights.com/beacon.min.js');
      script.dataset.cfBeacon = meta.getAttribute('content') ?? '';
      document.body.appendChild(script);
    }
  });
}
// end - analytics script

// metas
const appConfig = useAppConfig();

useHead({
  titleTemplate: titleChunk => titleChunk ? `${titleChunk} - ${appConfig.siteName}` : appConfig.siteName,
  htmlAttrs: {
    lang: 'ja-JP',
  },
});

useServerSeoMeta({
  referrer: 'same-origin',
  robots: 'noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai',
  twitterCard: 'summary',
});

useSeoMeta({
  ogTitle: appConfig.siteName,
  description: appConfig.siteDescription,
  ogDescription: appConfig.siteDescription,
});
// end - metas
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity var(--pageTransitionDuration) var(--pageTransitionFunction), filter var(--pageTransitionDuration) var(--pageTransitionFunction);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(4px);
}
</style>
