export const useColorScheme = () => {
  return useState<'light' | 'dark'>('colorScheme', () => 'light');
};
