// @ts-check
import { readFileSync } from 'node:fs';
import { join as joinPath, resolve } from 'node:path';
import { globSync } from 'glob';
import sjson from 'secure-json-parse';
import sanitize from 'sanitize-filename';
import { serializedStorySchema } from '../histoire/schema.js';

const histoire = serializedStorySchema.parse(sjson.parse(
  readFileSync('.histoire/dist/histoire.json', { encoding: 'utf8' })
));

/**
 * @param {string} path
 * @return {string[]}
 */
const listShotNames = (path) => {
  return globSync(joinPath(path, '**'), { withFileTypes: true })
    .filter(path => path.isFile())
    .map(path => joinPath(path.parentPath, path.name.includes('.') ? path.name.slice(0, path.name.lastIndexOf('.')) : path.name))
    .map(name => name.replace(resolve('./', path), '').replace(/^\//, ''));
};

export const interpret = () => {
  const baselineImages = listShotNames('.lostpixel/baseline/');
  const currentImages = listShotNames('.lostpixel/current/');
  const differenceImages = listShotNames('.lostpixel/difference/');

  const dissappearedImages = baselineImages.filter(imageName => !currentImages.includes(imageName));

  const addedStories = currentImages.map((imageName) => {
    if (baselineImages.includes(imageName)) return undefined;

    const [prefix, ...filenameFragment] = imageName.split('_');

    const prefixArray = (prefix ?? '').split('-');
    const darkMode = prefixArray.includes('darkMode');
    const verticalLayout = prefixArray.includes('verticalLayout');
    const smallScreen = prefixArray.includes('smallScreen');

    const [storyId, variantTitle, ...interactFragment] = filenameFragment;
    const interactStr = interactFragment.join('_');

    const story = histoire.stories.find(story => sanitize(story.id, { replacement: '-' }) === storyId && story.variants.some(variant => sanitize(variant.title, { replacement: '-' }) === variantTitle));
    if (story === undefined) return undefined;

    const variant = story.variants.find(variant => sanitize(variant.title, { replacement: '-' }) === variantTitle);
    if (variant === undefined) return undefined;

    const storyInteract = story.meta?.interact;
    const variantInteract = variant.meta?.interact;

    const interact = storyInteract
      ? storyInteract.find(i => sanitize(i.operation.map(op => Object.entries(op).slice(0, 1).map(pair => pair.join('-'))).join('--'), { replacement: '-' }) === interactStr)
      : variantInteract
        ? variantInteract.find(i => sanitize(i.operation.map(op => Object.entries(op).slice(0, 1).map(pair => pair.join('-'))).join('--'), { replacement: '-' }) === interactStr)
        : undefined;

    return {
      id: story.id,
      title: story.title,
      relativePath: story.relativePath,
      variantId: variant.id,
      variantTitle: variant.title,
      darkMode,
      verticalLayout,
      smallScreen,
      interact: interact ? JSON.stringify(interact) : undefined,
    };
  }).filter(storyInfo => storyInfo !== undefined);

  const differingStories = differenceImages.map((imageName) => {
    const [prefix, ...filenameFragment] = imageName.split('_');

    const prefixArray = (prefix ?? '').split('-');
    const darkMode = prefixArray.includes('darkMode');
    const verticalLayout = prefixArray.includes('verticalLayout');
    const smallScreen = prefixArray.includes('smallScreen');

    const [storyId, variantTitle, ...interactFragment] = filenameFragment;
    const interactStr = interactFragment.join('_');

    const story = histoire.stories.find(story => sanitize(story.id, { replacement: '-' }) === storyId && story.variants.some(variant => sanitize(variant.title, { replacement: '-' }) === variantTitle));
    if (story === undefined) return undefined;

    const variant = story.variants.find(variant => sanitize(variant.title, { replacement: '-' }) === variantTitle);
    if (variant === undefined) return undefined;

    const storyInteract = story.meta?.interact;
    const variantInteract = variant.meta?.interact;

    const interact = storyInteract
      ? storyInteract.find(i => sanitize(i.operation.map(op => Object.entries(op).slice(0, 1).map(pair => pair.join('-'))).join('--'), { replacement: '-' }) === interactStr)
      : variantInteract
        ? variantInteract.find(i => sanitize(i.operation.map(op => Object.entries(op).slice(0, 1).map(pair => pair.join('-'))).join('--'), { replacement: '-' }) === interactStr)
        : undefined;

    return {
      id: story.id,
      title: story.title,
      relativePath: story.relativePath,
      variantId: variant.id,
      variantTitle: variant.title,
      darkMode,
      verticalLayout,
      smallScreen,
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
|Story Title|Variant Title|Story Path|Dark Mode|Vertical Layout|Viewport Size|Interaction|
|-----------|-------------|----------|---------|---------------|-------------|-----------|
${differingStories.map(storyInfo => `|${storyInfo.title}|${storyInfo.variantTitle}|${storyInfo.relativePath}|${storyInfo.darkMode ? 'dark' : ''}|${storyInfo.verticalLayout ? 'vertical' : ''}|${storyInfo.smallScreen ? 'small' : ''}|${storyInfo.interact ?? ''}|`).join('\n')}\n\n`;
  }

  if (addedStories.length === 0) {
    markup += '✅There is no newly added stories.\n\n';
  }
  else {
    markup += `⚠️${addedStories.length} stories/variants were added.
|Story Title|Variant Title|Story Path|Dark Mode|Vertical Layout|Viewport Size|Interaction|
|-----------|-------------|----------|---------|---------------|-------------|-----------|
${addedStories.map(storyInfo => `|${storyInfo.title}|${storyInfo.variantTitle}|${storyInfo.relativePath}|${storyInfo.darkMode ? 'dark' : ''}|${storyInfo.verticalLayout ? 'vertical' : ''}|${storyInfo.smallScreen ? 'small' : ''}|${storyInfo.interact ?? ''}|`).join('\n')}\n\n`;
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
