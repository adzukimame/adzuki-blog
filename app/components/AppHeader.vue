<template>
  <Html :style="menuOpened ? { overflow: 'hidden' } : undefined" />
  <Body :style="menuOpened ? { overflow: 'hidden', touchAction: 'none' } : undefined" />
  <header
    v-bind="$attrs"
    class="header flex items-center justify-between block-full">
    <div
      class="grow shrink flex"
      data-testid="site-name">
      <NuxtLink
        to="/"
        class="whitespace-nowrap"
        @click="closeMenu">
        {{ runtimeConfig.public.siteName }}
      </NuxtLink>
    </div>
    <nav
      v-if="!props.useCollapsibleNavigation || menuOpened"
      ref="navEl"
      class="viewport-md:px-30 viewport-max-md:fixed viewport-max-md:inset-0 viewport-max-md:inset-bs-header-block viewport-max-md:max-block-[calc(100svb-var(--spacing-header-block))] viewport-max-md:inline-full viewport-max-md:bg-bg viewport-max-md:transition-colors viewport-max-md:duration-color-scheme"
      :class="menuOpened ? 'viewport-max-md:block' : 'viewport-max-md:hidden'">
      <ul class="flex gap-x-30 items-center p-0 m-0 list-none viewport-max-md:flex-col viewport-max-md:gap-y-10 viewport-max-md:items-start viewport-max-md:p-[24px]">
        <li
          v-for="item in menuItems"
          :key="item.to"
          class="viewport-max-md:px-8 viewport-max-md:border-s-[0.5rem] viewport-max-md:border-fg-weak viewport-max-md:responsive-hover:border-accent viewport-max-md:transition-[border-inline-start-color] duration-hover ease-hover">
          <NuxtLink
            :to="item.to"
            class="transition-colors duration-hover ease-hover responsive-hover:text-accent"
            @click="closeMenu()">
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="grow shrink flex justify-end gap-x-5">
      <button
        class="cursor-pointer inline-22 block-22 text-center rounded-md border-0 p-0 responsive-hover:bg-bg-strong transition-colors duration-hover ease-hover"
        :aria-label="`${colorScheme === 'dark' ? 'ライト' : 'ダーク'}モードに切り替える`"
        data-testid="color-switch"
        @click="manuallyUpdateColorScheme(colorScheme === 'light' ? 'dark' : 'light')">
        <IconMoon
          v-if="colorScheme === 'light'"
          class="block-14 inline-14 m-[calc((2.2rem-1.4rem)/2)]" />
        <IconSun
          v-else
          class="block-14 inline-14 m-[calc((2.2rem-1.4rem)/2)]" />
      </button>
      <button
        class="viewport-md:hidden viewport-max-md:block cursor-pointer inline-22 block-22 text-center rounded-md border-0 p-0 responsive-hover:bg-bg-strong transition-colors duration-hover ease-hover"
        :aria-label="`メニューを${menuOpened ? '閉じる' : '開く'}`"
        data-testid="menu-button"
        @click="() => {
          if (menuOpened) { closeMenu(); }
          else { openMenu() }
        }">
        <IconMenu
          v-if="!menuOpened"
          class="block-12 inline-12 m-[calc((2.2rem-1.2rem)/2)]" />
        <IconX
          v-else
          class="block-12 inline-12 m-[calc((2.2rem-1.2rem)/2)]" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import IconMoon from '@/assets/icons/Moon.svg';
import IconSun from '@/assets/icons/Sun.svg';
import IconMenu from '@/assets/icons/Menu.svg';
import IconX from '@/assets/icons/X.svg';

const props = withDefaults(defineProps<{
  useCollapsibleNavigation?: boolean;
}>(), {
  useCollapsibleNavigation: false,
});

const emits = defineEmits<{
  // (e: 'menuOpened' | 'menuClosed'): void;
  menuOpened: [];
  menuClosed: [];
}>();

const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();

const colorScheme = useColorScheme();

const menuOpened = ref(false);

watch(menuOpened, (newOpened) => {
  if (newOpened) {
    emits('menuOpened');
  }
  else {
    emits('menuClosed');
  }
});

const navEl = ref<HTMLElement | null>(null);
let animating = false;

const openMenu = () => {
  if (animating || menuOpened.value) {
    return;
  }
  animating = true;

  menuOpened.value = true;

  nextTick(() => {
    const anim = navEl.value?.animate([
      { opacity: 0, filter: 'blur(4px)' },
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

const closeMenu = () => {
  if (animating || !menuOpened.value) {
    return;
  }
  animating = true;

  const anim = navEl.value?.animate([
    { opacity: 1 },
    { opacity: 0, filter: 'blur(4px)' },
  ], {
    duration: appConfig.pageTransitionDuration,
    easing: appConfig.pageTransitionFunction,
  });

  anim?.addEventListener('finish', () => {
    menuOpened.value = false;
    animating = false;
  });
};

const menuItems = [
  {
    name: 'カテゴリ一覧',
    to: '/category',
  },
  {
    name: 'About',
    to: '/pages/about',
  },
];
</script>
