// @ts-check
import { readFileSync } from 'node:fs';
import { globSync } from 'glob';
import sjson from 'secure-json-parse';
import { serializedStorySchema } from '../histoire/schema.js';

const histoire = serializedStorySchema.parse(sjson.parse(
  readFileSync('.histoire/dist/histoire.json', { encoding: 'utf8' })
));

/**
 * @param {string} path
 * @return {string[]}
 */
const listShotNames = (path) => {
  return globSync(`${path}/**`, { withFileTypes: true })
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.parentPath + '/' + (dirent.name.includes('.') ? dirent.name.slice(0, dirent.name.lastIndexOf('.')) : dirent.name))
    .map(name => name.replace(path, '').replace(/^\/+/, ''));
};

export const interpret = () => {
  const baselineImages = listShotNames('.lostpixel/baseline/');
  const currentImages = listShotNames('.lostpixel/current/');
  const differenceImages = listShotNames('.lostpixel/difference/');

  const dissappearedImages = baselineImages.filter(imageName => !currentImages.includes(imageName));

  const addedStories = currentImages.map((imageName) => {
    if (baselineImages.includes(imageName)) return undefined;

    const darkMode = imageName.split('/')[0] === 'darkMode' || imageName.split('/')[0] === 'darkMode-verticalLayout';
    const verticalLayout = imageName.split('/')[0] === 'verticalLayout' || imageName.split('/')[0] === 'darkMode-verticalLayout';

    /** @type {string} */
    // @ts-expect-error
    const filename = imageName.split('/').pop();
    const [storyId, variantTitle, interactStr] = filename.split('_');

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
      darkMode,
      verticalLayout,
      interact: interact ? JSON.stringify(interact) : undefined,
    };
  }).filter(storyInfo => storyInfo !== undefined);

  const differingStories = differenceImages.map((imageName) => {
    const darkMode = imageName.split('/')[0] === 'darkMode' || imageName.split('/')[0] === 'darkMode-verticalLayout';
    const verticalLayout = imageName.split('/')[0] === 'verticalLayout' || imageName.split('/')[0] === 'darkMode-verticalLayout';

    /** @type {string} */
    // @ts-expect-error
    const filename = imageName.split('/').pop();
    const [storyId, variantTitle, interactStr] = filename.split('_');

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
      darkMode,
      verticalLayout,
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
|Story Title|Variant Title|Story Path|Dark Mode|Vertical Layout|Interaction|
|-----------|-------------|----------|---------|---------------|-----------|
${differingStories.map(storyInfo => `|${storyInfo.title}|${storyInfo.variantTitle}|${storyInfo.relativePath}|${storyInfo.darkMode ? 'dark' : ''}|${storyInfo.verticalLayout ? 'vertical' : ''}|${storyInfo.interact ?? ''}|`).join('\n')}\n\n`;
  }

  if (addedStories.length === 0) {
    markup += '✅There is no newly added stories.\n\n';
  }
  else {
    markup += `⚠️${addedStories.length} stories/variants were added.
|Story Title|Variant Title|Story Path|Dark Mode|Vertical Layout|Interaction|
|-----------|-------------|----------|---------|---------------|-----------|
${addedStories.map(storyInfo => `|${storyInfo.title}|${storyInfo.variantTitle}|${storyInfo.relativePath}|${storyInfo.darkMode ? 'dark' : ''}|${storyInfo.verticalLayout ? 'vertical' : ''}|${storyInfo.interact ?? ''}|`).join('\n')}\n\n`;
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
