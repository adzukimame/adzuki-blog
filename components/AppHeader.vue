<template>
  <Body :style="`overflow: ${menuOpened ? 'clip' : ''};`" />
  <header :class="$style.header">
    <div :class="$style.headerInner">
      <NuxtLink to="/"
                :class="$style.siteTitleContainer"
                @click="closeMenu">
        <div :class="$style.siteTitle">
          {{ appConfig.siteName }}
        </div>
      </NuxtLink>
      <nav v-if="!isNarrow || menuOpened"
           ref="navEl"
           :class="[$style.nav, { [$style.menuOpened]: menuOpened }]">
        <ul :class="$style.navList">
          <li v-for="item in menuItems"
              :key="item.to"
              :class="$style.navListItem">
            <NuxtLink :to="item.to"
                      @click="closeMenu()">
              {{ item.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
      <div :class="$style.buttonsContainer">
        <button :class="$style.colorSwitch"
                :aria-label="`${colorScheme === 'dark' ? 'ライト' : 'ダーク'}モードに切り替える`"
                @click="updateColorScheme(colorScheme === 'light' ? 'dark' : 'light')">
          <IconMoon v-if="colorScheme === 'light'"
                    :size="$style.darkModeSwitchIconSize"
                    aria-hidden="true" />
          <IconSun v-else
                   :size="$style.darkModeSwitchIconSize"
                   aria-hidden="true" />
        </button>
        <button :class="$style.menuButton"
                :aria-label="`メニューを${menuOpened ? '閉じる' : '開く'}`"
                @click="() => {
                  if (menuOpened) { closeMenu(); }
                  else { openMenu() }
                }">
          <IconMenu2 v-if="!menuOpened"
                     :size="$style.menuButtonIconSize"
                     aria-hidden="true" />
          <IconX v-else
                 :size="$style.menuButtonIconSize"
                 aria-hidden="true" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { IconMoon, IconSun, IconMenu2, IconX } from '@tabler/icons-vue';

const emits = defineEmits<{
  (e: 'menuOpened'): void;
  (e: 'menuClosed'): void; // eslint-disable-line @typescript-eslint/unified-signatures
}>();

const appConfig = useAppConfig();

const colorScheme = useColorScheme();

const updateColorScheme = (newColorScheme: 'dark' | 'light') => {
  if (newColorScheme === 'dark' || newColorScheme === 'light') {
    colorScheme.value = newColorScheme;
    window.localStorage.setItem('colorScheme', newColorScheme);
  }
};

const isNarrow = ref(false);
const menuOpened = ref(false);
const NARROW_THRESHOLD = 768;

onMounted(() => {
  isNarrow.value = window.innerWidth <= NARROW_THRESHOLD;
  window.addEventListener('resize', () => {
    isNarrow.value = window.innerWidth <= NARROW_THRESHOLD;
    if (!isNarrow.value) {
      menuOpened.value = false;
    }
  });
});

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
.header {
  position: sticky;
  inset-block-start: 0;
  z-index: 2;
  block-size: var(--headerHeight);
  border-block-end: solid var(--split) 2px;
  background-color: var(--bg);
  color: var(--fgStrong);
  transition: background-color var(--colorSchemeTransitionDuration);
}

.headerInner {
  display: block flex;
  align-items: center;
  justify-content: space-between;
  block-size: var(--headerHeight);
  max-inline-size: 768px;
  padding-inline: 24px;
  margin-inline: auto;
}

@media (max-width: 768px) {
  .headerInner {
    inline-size: 100%;
    padding-inline: 24px;
    margin-inline: 0;
  }
}

:root:global(.writing-mode-vertical-rl) .headerInner {
  inline-size: 100%;
  padding-inline: 32px;
  margin-inline: 0;
}

.siteTitleContainer {
  flex: 1 1;
  display: block flex;
  margin-inline-end: 3rem;
}

.siteTitle {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .nav {
    display: block;
    position: fixed;
    inset: 0;
    inset-block-start: var(--headerHeight);
    max-block-size: calc(100vb - var(--headerHeight));
    inline-size: 100%;
    background-color: var(--bg);
    transition: background-color var(--colorSchemeTransitionDuration);
  }

  .nav:not(.menuOpened) {
    display: none;
  }

  .nav.menuOpened {
    display: block;
  }
}

.navList {
  display: block flex;
  column-gap: 3rem;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style-type: none;
}

@media (max-width: 768px) {
  .navList {
    display: block flex;
    flex-direction: column;
    row-gap: 1rem;
    align-items: flex-start;
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .navListItem {
    padding-inline-start: 0.8rem;
    border-inline-start: solid 0.5rem var(--fgWeak);
    transition: border-inline-start-color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
  }

  @media (hover: hover) {
    .navListItem:hover {
      border-inline-start-color: var(--accent);
    }
  }

  @media (hover: none) {
    .navListItem:active {
      border-inline-start-color: var(--accent);
    }
  }
}

.navListItem>a {
  transition: color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

@media (hover: hover) {
  .navListItem>a:hover {
    color: var(--accent);
  }
}

@media (hover: none) {
  .navListItem>a:active {
    color: var(--accent);
  }
}

.buttonsContainer {
  flex: 1 1;
  display: block flex;
  justify-content: flex-end;
  column-gap: 0.5rem;
  margin-inline-start: 3rem;
}

@value darkModeSwitchAndMenuButtonSize: 2.2rem;
@value darkModeSwitchIconSize 1.4rem;
@value menuButtonIconSize: 1.2rem;

:export {
  darkModeSwitchIconSize: darkModeSwitchIconSize;
  menuButtonIconSize: menuButtonIconSize;
}

.buttonsContainer>button {
  cursor: pointer;
  inline-size: darkModeSwitchAndMenuButtonSize;
  block-size: darkModeSwitchAndMenuButtonSize;
  text-align: center;
  border-radius: 5px;
  border: 0;
  padding: 0;
  transition: background-color var(--hoverTransitionDuration) var(--hoverTransitionFunction);
}

@media (hover: hover) {
  .buttonsContainer>button:hover {
    background-color: var(--bgStrong);
  }
}

@media (hover: none) {
  .buttonsContainer>button:active {
    background-color: var(--bgStrong);
  }
}

.colorSwitch>svg {
  margin: calc((darkModeSwitchAndMenuButtonSize - darkModeSwitchIconSize) / 2);
}

.menuButton {
  display: none;
}

@media (max-width: 768px) {
  .menuButton {
    display: block;
  }
}

.menuButton>svg {
  margin: calc((darkModeSwitchAndMenuButtonSize - menuButtonIconSize) / 2);
}
</style>
