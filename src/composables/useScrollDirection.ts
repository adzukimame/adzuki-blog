export const useScrollDirection = () => {
  return useState<'up' | 'down' | null>('scrollDirection', () => null);
};
