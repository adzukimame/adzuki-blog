// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import sjson from 'secure-json-parse';
import { serializedStorySchema } from '../histoire/util.js';

const histoire = serializedStorySchema.parse(sjson.parse(
  readFileSync('.histoire/dist/histoire.json', { encoding: 'utf8' }),
));

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

    const [storyId, variantTitle, interactStr] = imageName.split('_');

    const story = histoire.stories.find(story => story.id === storyId && story.variants.some(variant => variant.title === variantTitle));
    if (story === undefined) return undefined;

    const variant = story.variants.find(variant => variant.title === variantTitle);
    if (variant === undefined) return undefined;

    const storyInteract = story.meta?.interact;
    const variantInteract = variant.meta?.interact;

    const interact = storyInteract
      ? storyInteract.find(i => i.map(op => Object.entries(op).map(pair => pair.join('-')).join('--')).join('---') === interactStr)
      : variantInteract
        ? variantInteract.find(i => i.map(op => Object.entries(op).map(pair => pair.join('-')).join('--')).join('---') === interactStr)
        : undefined;

    return {
      id: story.id,
      title: story.title,
      relativePath: story.relativePath,
      variantId: variant.id,
      variantTitle: variant.title,
      interact: interact ? JSON.stringify(interact) : undefined,
    };
  }).filter(storyInfo => storyInfo !== undefined);

  const differingStories = differenceImages.map((imageName) => {
    const [storyId, variantTitle, interactStr] = imageName.split('_');

    const story = histoire.stories.find(story => story.id === storyId && story.variants.some(variant => variant.title === variantTitle));
    if (story === undefined) return undefined;

    const variant = story.variants.find(variant => variant.title === variantTitle);
    if (variant === undefined) return undefined;

    const storyInteract = story.meta?.interact;
    const variantInteract = variant.meta?.interact;

    const interact = storyInteract
      ? storyInteract.find(i => i.map(op => Object.entries(op).map(pair => pair.join('-')).join('--')).join('---') === interactStr)
      : variantInteract
        ? variantInteract.find(i => i.map(op => Object.entries(op).map(pair => pair.join('-')).join('--')).join('---') === interactStr)
        : undefined;

    return {
      id: story.id,
      title: story.title,
      relativePath: story.relativePath,
      variantId: variant.id,
      variantTitle: variant.title,
      interact: interact ? JSON.stringify(interact) : undefined,
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
    markup += '✅No stories with differences was found.\n\n';
  }
  else {
    markup += `❌${differingStories.length} stories/variants have differences.
|Story Title|Variant Title|Story Path|Interaction|
|-----------|-------------|----------|--------|
${differingStories.map(storyInfo => `|${storyInfo.title}|${storyInfo.variantTitle}|${storyInfo.relativePath}|${storyInfo.interact ?? ''}|`).join('\n')}\n\n`;
  }

  if (addedStories.length === 0) {
    markup += '✅There is no newly added stories.\n\n';
  }
  else {
    markup += `⚠️${addedStories.length} stories/variants were added.
|Story Title|Variant Title|Story Path|Interaction|
|-----------|-------------|----------|--------|
${addedStories.map(storyInfo => `|${storyInfo.title}|${storyInfo.variantTitle}|${storyInfo.relativePath}|${storyInfo.interact ?? ''}|`).join('\n')}\n\n`;
  }

  if (dissappearedImages.length === 0) {
    markup += '✅No removed stories detected.';
  }
  else {
    markup += `❌${dissappearedImages.length} stories/variants appear to have been removed.
|baseline Image Name|
|-------------------|
${dissappearedImages.map(name => `|${name}|`).join('\n')}\n`;
  }

  return markup;
};
