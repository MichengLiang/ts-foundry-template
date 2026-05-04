import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { join } from "node:path";

const [, , templateName, targetName] = process.argv;
const templateMap = new Map([
	["react-spa", "templates/react-spa"],
	["hono-api", "templates/hono-api"],
	["fullstack", "templates/fullstack-hono-react"],
	["node-cli", "templates/node-cli"],
	["ts-lib", "templates/ts-lib"],
]);

if (!templateName || !targetName || !templateMap.has(templateName)) {
	console.error(
		"Usage: pnpm create:experiment <react-spa|hono-api|fullstack|node-cli|ts-lib> <name>",
	);
	process.exit(1);
}

const source = templateMap.get(templateName);

if (!source) {
	throw new Error(`Unknown template: ${templateName}`);
}

const target = join("experiments", targetName);

if (existsSync(target)) {
	console.error(`Target already exists: ${target}`);
	process.exit(1);
}

mkdirSync("experiments", { recursive: true });
cpSync(source, target, {
	recursive: true,
	filter: (path) =>
		!path.includes("node_modules") &&
		!path.includes("/.turbo") &&
		!path.includes("/dist") &&
		!path.includes("/coverage") &&
		!path.includes("/playwright-report") &&
		!path.includes("/test-results"),
});

const packageJsonPath = join(target, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
	name: string;
};
packageJson.name = `@ts-foundry-experiment/${targetName}`;
writeFileSync(
	`${packageJsonPath}`,
	`${JSON.stringify(packageJson, null, 2)}\n`,
);

console.log(`Created ${target} from ${source}`);
