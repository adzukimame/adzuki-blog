<template>
  <Html :class="[{ 'dark-mode': colorScheme === 'dark' }, { 'vertical-rl': writingMode === 'vertical-rl' }]" />
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
      textContent: `(()=>{try{const a=window.localStorage.getItem("colorScheme");"dark"===a?document.documentElement.classList.add("dark-mode"):null===a&&window.matchMedia("(prefers-color-scheme: dark)").matches&&document.documentElement.classList.add("dark-mode")}catch{window.matchMedia("(prefers-color-scheme: dark)").matches&&document.documentElement.classList.add("dark-mode")}})();`,
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
      textContent: `(()=>{const a=new URLSearchParams(location.search).get("tategaki");try{const b=window.localStorage.getItem("writingMode");"false"!==a&&(null!==a||"vertical-rl"===b)&&document.documentElement.classList.add("vertical-rl")}catch{null!==a&&"false"!==a&&document.documentElement.classList.add("vertical-rl")}})();`,
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
  transition: opacity var(--page-trans-dur) var(--page-trans-func), filter var(--page-trans-dur) var(--page-trans-func);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(4px);
}
</style>
