export const useWritingMode = () => {
  return useState<'vertical-rl' | 'horizontal-tb'>('writingMode', () => 'horizontal-tb');
};
