<template>
  <Html :class="[{ 'color-scheme-dark': colorScheme === 'dark' }, { 'writing-mode-vertical-rl': writingMode === 'vertical-rl' }]" />
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
      textContent: `
(() => {
  try {
    const savedColorScheme = window.localStorage.getItem('colorScheme');
    if (savedColorScheme === 'dark') {
      document.documentElement.classList.add('color-scheme-dark');
    } else if (savedColorScheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('color-scheme-dark');
    }
  }
  catch {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('color-scheme-dark');
    }
  }
})();
`,
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
      textContent: `
(() => {
  const queryWritingMode = new URLSearchParams(location.search).get('tategaki');
  try {
    const savedWritingMode = window.localStorage.getItem('writingMode');
    if (queryWritingMode !== 'false' && (queryWritingMode !== null || savedWritingMode === 'vertical-rl')) {
      document.documentElement.classList.add('writing-mode-vertical-rl');
    }
  }
  catch {
    if (queryWritingMode !== null && queryWritingMode !== 'false') {
      document.documentElement.classList.add('writing-mode-vertical-rl');
    }
  }
})();
`,
    },
  ],
});

const writingMode = useWritingMode();

onMounted(() => {
  initReactiveWritingMode();
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
  titleTemplate: titleChunk => titleChunk ? `${titleChunk} - ${runtimeConfig.public.siteName}` : runtimeConfig.public.siteName,
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
  transition: opacity var(--pageTransitionDuration) var(--pageTransitionFunction), filter var(--pageTransitionDuration) var(--pageTransitionFunction);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(4px);
}
</style>
