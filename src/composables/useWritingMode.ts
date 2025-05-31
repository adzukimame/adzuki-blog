export const useWritingMode = () => {
  return useState<'vertical-rl' | null>('writingMode', () => null);
};
