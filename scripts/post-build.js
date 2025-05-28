// @ts-check
import { copyFileSync, rmSync, globSync } from 'node:fs';

// _headers
copyFileSync('./_headers', './dist/_headers');

globSync('./dist/api/_content/cache.*.json').forEach((path) => {
  rmSync(path, { force: true });
});
