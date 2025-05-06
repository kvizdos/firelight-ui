// generate-exports.js
import { readdirSync, statSync } from 'fs';
import path from 'path';

const baseDirs = ['charts', 'animations', 'modal', 'feedback', 'buttons', 'inputs', 'progress'];
const distDir = './dist';

const exportsMap = {
  '.': {
    import: './dist/index.js',
    types: './dist/index.d.ts',
  },
};

for (const dir of baseDirs) {
  const fullPath = path.join(distDir, dir);
  const files = readdirSync(fullPath);

  for (const file of files) {
    const jsMatch = file.match(/^(.*)\.js$/);
    if (!jsMatch) continue;

    const baseName = jsMatch[1];
    const subpath = `./${dir}/${baseName}`;
    exportsMap[subpath] = {
      import: `./dist/${dir}/${baseName}.js`,
      types: `./dist/${dir}/${baseName}.d.ts`,
    };
  }
}

console.log(JSON.stringify({ exports: exportsMap }, null, 2));
