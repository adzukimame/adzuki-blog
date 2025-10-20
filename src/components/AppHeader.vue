<template>
  <Body :style="menuOpened ? { overflow: 'hidden', touchAction: 'none' } : undefined" />
  <header
    v-bind="$attrs"
    :class="$style.header">
    <div
      :class="$style.siteNameContainer"
      data-testid="site-name">
      <NuxtLink
        to="/"
        :class="$style.title"
        @click="closeMenu">
        {{ runtimeConfig.public.siteName }}
      </NuxtLink>
    </div>
    <nav
      v-if="!props.useCollapsibleNavigation || menuOpened"
      ref="navEl"
      :class="[$style.navigation, { [$style.menuOpened]: menuOpened }]">
      <ul :class="$style.navigationList">
        <li
          v-for="item in menuItems"
          :key="item.to"
          :class="$style.navigationListItem">
          <NuxtLink
            :to="item.to"
            @click="closeMenu()">
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <div :class="$style.buttonsContainer">
      <button
        :class="$style.buttonColorSwitch"
        :aria-label="`${colorScheme === 'dark' ? 'ライト' : 'ダーク'}モードに切り替える`"
        data-testid="color-switch"
        @click="manuallyUpdateColorScheme(colorScheme === 'light' ? 'dark' : 'light')">
        <svg
          v-if="colorScheme === 'light'"
          xmlns="http://www.w3.org/2000/svg"
          width="1.4rem"
          height="1.4rem"
          size="1.4rem"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true">
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="1.4rem"
          height="1.4rem"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true">
          <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
          <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
        </svg>
      </button>
      <button
        :class="$style.buttonMenu"
        :aria-label="`メニューを${menuOpened ? '閉じる' : '開く'}`"
        data-testid="menu-button"
        @click="() => {
          if (menuOpened) { closeMenu(); }
          else { openMenu() }
        }">
        <svg
          v-if="!menuOpened"
          xmlns="http://www.w3.org/2000/svg"
          width="1.2rem"
          height="1.2rem"
          size="1.2rem"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true">
          <path d="M4 6l16 0" />
          <path d="M4 12l16 0" />
          <path d="M4 18l16 0" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="1.2rem"
          height="1.2rem"
          size="1.2rem"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
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

<style module>
@value horizontalSmall, verticalSmall from "~/assets/css/breakpoints.module.css";

.header {
  --header-button-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  block-size: 100%;
}

.siteNameContainer {
  flex: 1 1;
  display: block flex;
}

.title {
  white-space: nowrap;
}

.navigation {
  :root:not(:global(.vertical-rl)) & {
    @media not horizontalSmall {
      padding-inline: 3rem;
    }
  }

  :root:global(.vertical-rl) & {
    @media not verticalSmall {
      padding-inline: 3rem;
    }
  }

  :root:not(:global(.vertical-rl)) & {
    @media horizontalSmall {
      display: block;
      position: fixed;
      inset: 0;
      inset-block-start: var(--header-bsize);
      max-block-size: calc(100svb - var(--header-bsize));
      inline-size: 100%;
      background-color: var(--bg);
      transition: background-color var(--color-scheme-trans-dur);

      &:not(.menuOpened) {
        display: none;
      }

      &.menuOpened {
        display: block;
      }
    }
  }

  :root:global(.vertical-rl) & {
    @media verticalSmall {
      display: block;
      position: fixed;
      inset: 0;
      inset-block-start: var(--header-bsize);
      max-block-size: calc(100svb - var(--header-bsize));
      inline-size: 100%;
      background-color: var(--bg);
      transition: background-color var(--color-scheme-trans-dur);

      &:not(.menuOpened) {
        display: none;
      }

      &.menuOpened {
        display: block;
      }
    }
  }
}

.navigationList {
  display: flex;
  column-gap: 3rem;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style-type: none;

  :root:not(:global(.vertical-rl)) & {
    @media horizontalSmall {
      flex-direction: column;
      row-gap: 1rem;
      align-items: flex-start;
      padding: 24px;
    }
  }

  :root:global(.vertical-rl) & {
    @media verticalSmall {
      flex-direction: column;
      row-gap: 1rem;
      align-items: flex-start;
      padding: 24px;
    }
  }
}

:root:not(:global(.vertical-rl)) .navigationListItem {
  @media horizontalSmall {
    padding-inline-start: 0.8rem;
    border-inline-start: solid 0.5rem var(--fg-weak);
    transition: border-inline-start-color var(--hover-trans-dur) var(--hover-trans-func);

    @media (hover: hover) {
      &:hover {
        border-inline-start-color: var(--accent);
      }
    }

    @media (hover: none) {
      &:active {
        border-inline-start-color: var(--accent);
      }
    }
  }
}

:root:global(.vertical-rl) .navigationListItem {
  @media verticalSmall {
    padding-inline-start: 0.8rem;
    border-inline-start: solid 0.5rem var(--fg-weak);
    transition: border-inline-start-color var(--hover-trans-dur) var(--hover-trans-func);

    @media (hover: hover) {
      &:hover {
        border-inline-start-color: var(--accent);
      }
    }

    @media (hover: none) {
      &:active {
        border-inline-start-color: var(--accent);
      }
    }
  }
}

.navigationListItem>a {
  transition: color var(--hover-trans-dur) var(--hover-trans-func);
}

@media (hover: hover) {
  .navigationListItem>a:hover {
    color: var(--accent);
  }
}

@media (hover: none) {
  .navigationListItem>a:active {
    color: var(--accent);
  }
}

.buttonsContainer {
  flex: 1 1;
  display: block flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
}

.buttonsContainer>button {
  cursor: pointer;
  inline-size: var(--header-button-size);
  block-size: var(--header-button-size);
  text-align: center;
  border-radius: 5px;
  border: 0;
  padding: 0;
  transition: background-color var(--hover-trans-dur) var(--hover-trans-func);
}

@media (hover: hover) {
  .buttonsContainer>button:hover {
    background-color: var(--bg-strong);
  }
}

@media (hover: none) {
  .buttonsContainer>button:active {
    background-color: var(--bg-strong);
  }
}

.buttonColorSwitch>svg {
  margin: calc((var(--header-button-size) - 1.4rem) / 2);
}

.buttonMenu {
  display: none;

  :root:not(:global(.vertical-rl)) & {
    @media horizontalSmall {
      display: block;
    }
  }

  :root:global(.vertical-rl) & {
    @media verticalSmall {
      display: block;
    }
  }
}

.buttonMenu>svg {
  margin: calc((var(--header-button-size) - 1.2rem) / 2);
}
</style>
