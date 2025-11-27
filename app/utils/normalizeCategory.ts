export const normalizeCategory = (category: unknown): string[] | undefined => {
  if (Array.isArray(category)) {
    const filtered = category.filter((el, idx, arr) => typeof el === 'string' && el !== 'undefined' && arr.indexOf(el) === idx);
    return filtered.length === 0 ? undefined : filtered;
  }
  else if (typeof category === 'string' && category !== 'undefined') {
    return [category];
  }
  else {
    return undefined;
  }
};
