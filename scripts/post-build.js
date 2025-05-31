// @ts-check
import { copyFileSync, readdirSync, rmSync } from 'node:fs';
import { join as joinPath } from 'node:path';

// _headers
copyFileSync('./_headers', './dist/_headers');

readdirSync('./dist/api/_content/', { withFileTypes: true }).filter(
  dirent => dirent.isFile() && dirent.name.match(/^cache\.\d+\.json$/)
).map(
  dirent => joinPath('./dist/api/_content/', dirent.name)
).forEach(
  path => rmSync(path)
);
