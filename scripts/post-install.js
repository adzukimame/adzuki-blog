import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

// content dir
{
  const contentExists = existsSync('./content');

  if (!contentExists) {
    mkdirSync('./content');
  }
}

// meta.json
{
  const metaExists = existsSync('./content/meta.json');

  if (!metaExists) {
    writeFileSync('./content/meta.json', '{}', { encoding: 'utf8' });
  }
}
