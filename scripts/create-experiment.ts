import {
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	writeFileSync,
} from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";

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

function isPathInside(parent: string, child: string) {
	const relativePath = relative(parent, child);

	return (
		relativePath.length > 0 &&
		!relativePath.startsWith("..") &&
		!isAbsolute(relativePath)
	);
}

function validateTargetName(name: string) {
	const packageName = `@ts-foundry-experiment/${name}`;

	if (packageName.length > 214) {
		return "generated npm package name must be 214 characters or fewer";
	}

	if (name !== name.toLowerCase()) {
		return "target name must be lowercase";
	}

	if (name.startsWith(".") || name.startsWith("_")) {
		return "target name cannot start with a dot or underscore";
	}

	if (name === "node_modules" || name === "favicon.ico") {
		return "target name is reserved by npm";
	}

	if (encodeURIComponent(name) !== name) {
		return "target name must be a valid unscoped npm package name segment";
	}

	return undefined;
}

function e2ePortForTargetName(name: string) {
	let hash = 0;

	for (const character of name) {
		hash = (hash * 31 + character.charCodeAt(0)) % 1000;
	}

	return 42_00 + hash;
}

function rewriteFrontendE2ePort(target: string, port: number) {
	const packageJsonPath = resolve(target, "package.json");
	const playwrightConfigPath = resolve(target, "playwright.config.ts");

	if (!existsSync(playwrightConfigPath)) {
		return;
	}

	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
		scripts?: Record<string, string>;
	};
	const e2eScript = packageJson.scripts?.e2e;

	if (e2eScript) {
		packageJson.scripts = {
			...packageJson.scripts,
			e2e: `E2E_PORT=\${E2E_PORT:-${port}}; export E2E_PORT; ${e2eScript
				.replace(/--port \d+/g, "--port $E2E_PORT")
				.replace(/http:\/\/127\.0\.0\.1:\d+/g, "http://127.0.0.1:$E2E_PORT")}`,
		};
		writePackageJson(packageJsonPath, packageJson);
	}

	const playwrightConfig = readFileSync(playwrightConfigPath, "utf8").replace(
		/baseURL: "http:\/\/127\.0\.0\.1:\d+"/g,
		() => `baseURL: \`http://127.0.0.1:\${process.env.E2E_PORT ?? "${port}"}\``,
	);
	writeFileSync(playwrightConfigPath, playwrightConfig);
}

function writePackageJson(path: string, packageJson: unknown) {
	writeFileSync(path, `${JSON.stringify(packageJson, null, "\t")}\n`);
}

const source = templateMap.get(templateName);

if (!source) {
	throw new Error(`Unknown template: ${templateName}`);
}

const validationError = validateTargetName(targetName);

if (validationError) {
	console.error(`Invalid target name: ${validationError}`);
	process.exit(1);
}

const experimentsRoot = resolve("experiments");
const target = resolve(experimentsRoot, targetName);

if (!isPathInside(experimentsRoot, target)) {
	console.error("Invalid target name: target must stay inside experiments/");
	process.exit(1);
}

if (existsSync(target)) {
	console.error(`Target already exists: experiments/${targetName}`);
	process.exit(1);
}

mkdirSync(experimentsRoot, { recursive: true });
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

const packageJsonPath = resolve(target, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
	name: string;
};
packageJson.name = `@ts-foundry-experiment/${targetName}`;
writePackageJson(packageJsonPath, packageJson);

rewriteFrontendE2ePort(target, e2ePortForTargetName(targetName));

console.log(`Created experiments/${targetName} from ${source}`);
