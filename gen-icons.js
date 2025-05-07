import fs from "fs";
import path from "path";
import { optimize } from "svgo";

const srcDir = path.resolve("./src/icons/icon-src");
const outFile = path.resolve("./src/icons/icons.ts");

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".svg"));

const iconMap = [];

for (const file of files) {
	const name = path.basename(file, ".svg");
	const raw = fs.readFileSync(path.join(srcDir, file), "utf8");
	const { data } = optimize(raw, {
		multipass: true,
		plugins: [
			{
				name: "preset-default",
				params: {
					overrides: {
						removeUnknownsAndDefaults: {
							keepStrokeAndFill: true,
						},
						removeUselessStrokeAndFill: false, // <== this is key
					},
				},
			},
			{
				name: "removeAttrs",
				params: {
					attrs: "", // empty string disables removing any attributes
				},
			},
		],
	});

	const minified = data
		.replace(/`/g, "\\`") // escape backticks
		.replace(/\n\s*/g, ""); // remove newlines and extra space

	iconMap.push(`  "${name}": html\`${minified}\`,`);
}

const result = `import { html } from 'lit';\n\nexport const icons: Record<string, ReturnType<typeof html>> = {\n${iconMap.join("\n")}\n};\n`;

fs.writeFileSync(outFile, result);
console.log(`✅ icons.ts generated with ${iconMap.length} icons.`);
