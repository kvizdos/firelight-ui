// scripts/generate-exports.js
import { readdirSync, statSync } from "fs";
import { join, relative, parse } from "path";

function walk(dir, prefix = "") {
	const files = readdirSync(dir, { withFileTypes: true });
	const exports = {};

	for (const file of files) {
		const fullPath = join(dir, file.name);
		const relPath = relative("dist", fullPath).replace(/\\/g, "/");

		if (file.isDirectory()) {
			Object.assign(exports, walk(fullPath, `${prefix}/${file.name}`));
		} else if (file.isFile() && file.name.endsWith(".js")) {
			const { dir: jsDir, name } = parse(relPath);
			const key = `${prefix}/${name}`;
			const basePath = `./dist/${jsDir}/${name}`;

			exports[`./${jsDir}/${name}`] = {
				import: `${basePath}.js`,
				types: `${basePath}.d.ts`,
			};
		}
	}

	return exports;
}

const result = walk("dist");
console.log(JSON.stringify({ exports: result }, null, 2));
