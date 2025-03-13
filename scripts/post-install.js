import { existsSync, writeFileSync } from 'node:fs';

// meta.json
{
  const metaExists = existsSync('./content/meta.json');

  if (!metaExists) {
    writeFileSync('./content/meta.json', '{}', { encoding: 'utf8' });
  }
}
