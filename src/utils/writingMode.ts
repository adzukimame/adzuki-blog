export const initReactiveWritingMode = () => {
  const writingMode = useWritingMode();
  const requestUrl = useRequestURL();

  const queryWritingMode = new URLSearchParams(requestUrl.search).get('tategaki');
  try {
    const savedWritingMode = window.localStorage.getItem('writingMode');
    if (queryWritingMode === 'false') {
      window.localStorage.removeItem('writingMode');
    }
    else if (queryWritingMode !== null || savedWritingMode === 'vertical-rl') {
      writingMode.value = 'vertical-rl';
      window.localStorage.setItem('writingMode', 'vertical-rl');
    }
  }
  catch {
    if (queryWritingMode !== null && queryWritingMode !== 'false') {
      writingMode.value = 'vertical-rl';
    }
  }
};
