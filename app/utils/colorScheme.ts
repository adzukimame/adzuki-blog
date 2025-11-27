export const initReactiveColorScheme = () => {
  const colorScheme = useColorScheme();

  try {
    const savedColorScheme = window.localStorage.getItem('colorScheme');
    if (savedColorScheme === 'light' || savedColorScheme === 'dark') {
      colorScheme.value = savedColorScheme;
    }
    else {
      window.localStorage.removeItem('colorScheme');
      colorScheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  }
  catch {
    colorScheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
};

export const manuallyUpdateColorScheme = (newColorScheme: 'light' | 'dark') => {
  const colorScheme = useColorScheme();
  colorScheme.value = newColorScheme;
  try {
    window.localStorage.setItem('colorScheme', newColorScheme);
  }
  catch {
    // nop
  }
};

export const preferredColorSchemeChangeListener = (event: MediaQueryListEvent) => {
  const regexResult = (/^\(prefers-color-scheme: (light|dark)\)$/).exec(event.media);
  if (!regexResult) {
    return;
  }

  const colorScheme = useColorScheme();

  const newColorScheme
    = ((regexResult[1] === 'light' && event.matches) || (regexResult[1] === 'dark' && !event.matches))
      ? 'light'
      : 'dark';

  try {
    if (window.localStorage.getItem('colorScheme') === null) {
      colorScheme.value = newColorScheme;
    }
  }
  catch {
    colorScheme.value = newColorScheme;
  }
};
