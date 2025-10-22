export const initReactiveWritingMode = () => {
  const writingMode = useWritingMode();
  const requestUrl = useRequestURL();

  const queryVertical = new URLSearchParams(requestUrl.search).get('tategaki');
  try {
    const savedWritingMode = window.localStorage.getItem('writingMode');
    if (queryVertical === 'false') {
      writingMode.value = 'horizontal-tb';
      window.localStorage.setItem('writingMode', 'horizontal-tb');
    }
    else if (queryVertical !== null) {
      writingMode.value = 'vertical-rl';
      window.localStorage.setItem('writingMode', 'vertical-rl');
    }
    else if (savedWritingMode === 'horizontal-tb' || savedWritingMode === null) {
      writingMode.value = 'horizontal-tb';
      window.localStorage.setItem('writingMode', 'horizontal-tb');
    }
    else if (savedWritingMode === 'vertical-rl') {
      writingMode.value = 'vertical-rl';
      window.localStorage.setItem('writingMode', 'vertical-rl');
    }
  }
  catch {
    if (queryVertical === 'false') {
      writingMode.value = 'horizontal-tb';
    }
    else {
      writingMode.value = 'vertical-rl';
    }
  }
};
