// @ts-check
import { readdirSync, readFileSync } from 'node:fs';

const rawHistoire = readFileSync('.histoire/dist/histoire.json', { encoding: 'utf8' });
const histoire = JSON.parse(rawHistoire);

/**
 * @param {string} path
 * @return {string[]}
 */
const listBaseFilenames = (path) => {
  return readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name.includes('.') ? dirent.name.slice(0, dirent.name.lastIndexOf('.')) : dirent.name);
};

export const interpret = () => {
  const baselineImages = listBaseFilenames('.lostpixel/baseline/');
  const currentImages = listBaseFilenames('.lostpixel/current/');
  const differenceImages = listBaseFilenames('.lostpixel/difference/');

  const dissappearedImages = baselineImages.filter(imageName => !currentImages.includes(imageName));

  const addedStories = currentImages.map((imageName) => {
    if (baselineImages.includes(imageName)) return undefined;

    const storyId = imageName.slice(0, imageName.indexOf('_'));
    const variantTitle = imageName.slice(imageName.indexOf('_') + 1, imageName.length);

    const story = histoire.stories.find(/** @param {any} story */ story => story.id === storyId && story.variants.some(/** @param {any} variant */ variant => variant.title === variantTitle));
    if (story === undefined) return undefined;

    const variant = story.variants.find(/** @param {any} variant */ variant => variant.title === variantTitle);
    if (variant === undefined) return undefined;

    return {
      id: story.id,
      title: story.title,
      relativePath: story.relativePath,
      variantId: variant.id,
      variantTitle: variant.title,
    };
  }).filter(storyInfo => storyInfo !== undefined);

  const differingStories = differenceImages.map((imageName) => {
    const storyId = imageName.slice(0, imageName.indexOf('_'));
    const variantTitle = imageName.slice(imageName.indexOf('_') + 1, imageName.length);

    const story = histoire.stories.find(/** @param {any} story */ story => story.id === storyId && story.variants.some(/** @param {any} variant */ variant => variant.title === variantTitle));
    if (story === undefined) return undefined;

    const variant = story.variants.find(/** @param {any} variant */ variant => variant.title === variantTitle);
    if (variant === undefined) return undefined;

    return {
      id: story.id,
      title: story.title,
      relativePath: story.relativePath,
      variantId: variant.id,
      variantTitle: variant.title,
    };
  }).filter(storyInfo => storyInfo !== undefined);

  return {
    dissappearedImages,
    addedStories,
    differingStories,
  };
};

export const interpretAndMarkup = () => {
  const { dissappearedImages, addedStories, differingStories } = interpret();

  let markup = '';

  if (differingStories.length === 0) {
    markup += 'No stories with differences was found.\n\n';
  }
  else {
    markup += `${differingStories.length} stories/variants have differences.
|Story Title|Variant Title|Story Path|
|-----------|-------------|----------|
${differingStories.map(storyInfo => `|${storyInfo.title}|${storyInfo.variantTitle}|${storyInfo.relativePath}|`).join('\n')}\n\n`;
  }

  if (addedStories.length === 0) {
    markup += 'There is no newly added stories.\n\n';
  }
  else {
    markup += `${addedStories.length} stories/variants were added.
|Story Title|Variant Title|Story Path|
|-----------|-------------|----------|
${addedStories.map(storyInfo => `|${storyInfo.title}|${storyInfo.variantTitle}|${storyInfo.relativePath}|`).join('\n')}\n\n`;
  }

  if (dissappearedImages.length === 0) {
    markup += 'No removed stories detected.';
  }
  else {
    markup += `${dissappearedImages.length} stories/variants appear to have been removed.
|baseline Image Name|
|-------------------|
${dissappearedImages.map(name => `|${name}|`).join('\n')}\n`;
  }

  return markup;
};
