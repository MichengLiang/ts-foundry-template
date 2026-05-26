import {
	cpSync,
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const [, , targetName, targetDir] = process.argv;

if (!targetName || !targetDir) {
	console.error(
		"Usage: tsx scripts/instantiate-monorepo.ts <name> <parent-dir>",
	);
	console.error(
		"  Example: tsx scripts/instantiate-monorepo.ts micheng-ts ../",
	);
	process.exit(1);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isPathInside(parent: string, child: string) {
	const relativePath = relative(parent, child);

	return (
		relativePath.length > 0 &&
		!relativePath.startsWith("..") &&
		!isAbsolute(relativePath)
	);
}

function validateName(name: string) {
	if (name !== name.toLowerCase()) {
		return "name must be lowercase";
	}

	if (name.startsWith(".") || name.startsWith("_")) {
		return "name cannot start with a dot or underscore";
	}

	if (name.includes(" ")) {
		return "name cannot contain spaces";
	}

	if (encodeURIComponent(name) !== name) {
		return "name must be a valid URL-safe identifier";
	}

	return undefined;
}

const validationError = validateName(targetName);

if (validationError) {
	console.error(`Invalid name: ${validationError}`);
	process.exit(1);
}

const parentDir = resolve(targetDir);

if (!existsSync(parentDir) || !statSync(parentDir).isDirectory()) {
	console.error(`Parent directory does not exist: ${targetDir}`);
	process.exit(1);
}

const target = resolve(parentDir, targetName);

if (!isPathInside(parentDir, target)) {
	console.error("Invalid name: target must stay inside the parent directory");
	process.exit(1);
}

if (existsSync(target)) {
	console.error(`Target already exists: ${target}`);
	process.exit(1);
}

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------

const source = resolve(".");

mkdirSync(target, { recursive: true });
cpSync(source, target, {
	recursive: true,
	filter: (path) => {
		const name = path.split("/").pop() ?? path.split("\\").pop() ?? "";

		return (
			name !== "node_modules" &&
			name !== ".turbo" &&
			name !== "dist" &&
			name !== "coverage" &&
			name !== "playwright-report" &&
			name !== "test-results" &&
			name !== ".git" &&
			name !== "tmp" &&
			name !== "external"
		);
	},
});

// ---------------------------------------------------------------------------
// Name derivation
// ---------------------------------------------------------------------------

const displayName = targetName
	.split(/[-_]/)
	.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
	.join(" ");

// ---------------------------------------------------------------------------
// Root package.json
// ---------------------------------------------------------------------------

const rootPkgPath = join(target, "package.json");
const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf8")) as Record<
	string,
	unknown
>;

rootPkg.name = targetName;

if (rootPkg.repository && typeof rootPkg.repository === "object") {
	const repo = rootPkg.repository as Record<string, string>;

	if (repo.url) {
		repo.url = repo.url.replace(/ts-foundry-template/g, targetName);
	}
}

if (rootPkg.bugs && typeof rootPkg.bugs === "object") {
	const bugs = rootPkg.bugs as Record<string, string>;

	if (bugs.url) {
		bugs.url = bugs.url.replace(/ts-foundry-template/g, targetName);
	}
}

if (rootPkg.homepage && typeof rootPkg.homepage === "string") {
	rootPkg.homepage = rootPkg.homepage.replace(
		/ts-foundry-template/g,
		targetName,
	);
}

writeFileSync(rootPkgPath, `${JSON.stringify(rootPkg, null, "\t")}\n`);

// ---------------------------------------------------------------------------
// Template package.json names
// @ts-foundry-template/<template> → @ts-foundry/<template>
// ---------------------------------------------------------------------------

const templatesDir = join(target, "templates");

if (existsSync(templatesDir)) {
	for (const entry of readdirSync(templatesDir)) {
		const pkgPath = join(templatesDir, entry, "package.json");

		if (!existsSync(pkgPath)) {
			continue;
		}

		const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as Record<
			string,
			unknown
		>;

		if (typeof pkg.name === "string") {
			pkg.name = pkg.name.replace(
				"@ts-foundry-template/",
				"@ts-foundry/",
			);
		}

		writeFileSync(pkgPath, `${JSON.stringify(pkg, null, "\t")}\n`);
	}
}

// ---------------------------------------------------------------------------
// Test description strings
// "node-cli template" → "node-cli", "ts-lib template" → "ts-lib"
// ---------------------------------------------------------------------------

function rewriteTestDescriptions(dir: string) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const stat = statSync(full);

		if (stat.isDirectory()) {
			rewriteTestDescriptions(full);
		} else if (entry.endsWith(".test.ts") || entry.endsWith(".test.tsx")) {
			const content = readFileSync(full, "utf8");
			const replaced = content.replace(
				/["`]\s*(\S+)\s+template\s*["`]/g,
				(_match, name: string) => `"${name}"`,
			);

			if (replaced !== content) {
				writeFileSync(full, replaced);
			}
		}
	}
}

rewriteTestDescriptions(join(target, "templates"));

// ---------------------------------------------------------------------------
// Markdown & text files: replace identity strings
// ---------------------------------------------------------------------------

const displayNameLower = displayName.toLowerCase();

const textReplacements: Array<[RegExp, string]> = [
	// Full display name (case-sensitive, do this before the lowercase version)
	[/TS Foundry Template/g, displayName],
	// Lowercase identity
	[/ts-foundry-template/g, targetName],
];

function rewriteTextFile(filePath: string) {
	const content = readFileSync(filePath, "utf8");
	let replaced = content;

	for (const [pattern, replacement] of textReplacements) {
		replaced = replaced.replace(pattern, replacement);
	}

	if (replaced !== content) {
		writeFileSync(filePath, replaced);
	}
}

const textExtensions = new Set([".md", ".yml", ".yaml", ".json", ".txt"]);

function walkAndRewrite(dir: string) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const stat = statSync(full);

		if (stat.isDirectory()) {
			// Skip directories we already handle separately
			if (entry === "templates" || entry === "node_modules" || entry === ".git") {
				continue;
			}

			walkAndRewrite(full);
		} else {
			const ext = entry.slice(entry.lastIndexOf("."));

			if (textExtensions.has(ext) && entry !== "pnpm-lock.yaml") {
				rewriteTextFile(full);
			}
		}
	}
}

walkAndRewrite(target);

// Also handle the NOTICE file (no extension)
const noticePath = join(target, "NOTICE");

if (existsSync(noticePath)) {
	rewriteTextFile(noticePath);
}

// ---------------------------------------------------------------------------
// Done
// ---------------------------------------------------------------------------

console.log(`Instantiated ${targetName} at ${target}`);
console.log(`  Root package name: ${targetName}`);
console.log(`  Display name: ${displayName}`);
console.log(`  Template packages: @ts-foundry-template/* → @ts-foundry/*`);
