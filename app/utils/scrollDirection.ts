const lastScrollPosition = { value: 0 };

export const updateScrollDirection = (): void => {
  const scrollDirection = useScrollDirection();
  const writingMode = useWritingMode();

  const currentScrollPosition = writingMode.value === 'vertical-rl' ? -window.scrollX : window.scrollY;

  if (currentScrollPosition === 0) {
    scrollDirection.value = 'up';
  }
  else if (Math.abs(lastScrollPosition.value - currentScrollPosition) < 5) {
    // nop
  }
  else if (currentScrollPosition > lastScrollPosition.value && currentScrollPosition > 0) {
    scrollDirection.value = 'down';
  }
  else if (currentScrollPosition < lastScrollPosition.value) {
    scrollDirection.value = 'up';
  }

  lastScrollPosition.value = currentScrollPosition;
};
