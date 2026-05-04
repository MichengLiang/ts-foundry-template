import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const repoRoot = process.cwd();
const experimentsDir = join(repoRoot, "experiments");
const escapedTarget = join(repoRoot, "worker-c-escaped");
const validTargetName = "worker-c-react-spa-smoke";
const validTarget = join(experimentsDir, validTargetName);
const invalidTargets = [
	"../worker-c-escaped",
	"bad name",
	"@scope/name",
	".hidden",
	"UPPERCASE",
];

function runCreateExperiment(templateName: string, targetName: string) {
	return spawnSync(
		"pnpm",
		["exec", "tsx", "scripts/create-experiment.ts", templateName, targetName],
		{
			cwd: repoRoot,
			encoding: "utf8",
		},
	);
}

function cleanup() {
	rmSync(validTarget, { force: true, recursive: true });
	rmSync(escapedTarget, { force: true, recursive: true });
	for (const targetName of invalidTargets) {
		rmSync(join(experimentsDir, targetName), { force: true, recursive: true });
	}
	rmSync(join(experimentsDir, "@scope"), { force: true, recursive: true });
}

describe("create-experiment", () => {
	beforeEach(cleanup);
	afterEach(cleanup);

	test.each(invalidTargets)("rejects invalid target name %s", (targetName) => {
		const result = runCreateExperiment("ts-lib", targetName);

		expect(result.status).not.toBe(0);
		expect(`${result.stderr}${result.stdout}`).toContain("Invalid target name");
		expect(existsSync(escapedTarget)).toBe(false);
	});

	test("generates a frontend experiment with tab-indented package metadata and isolated e2e port", () => {
		const result = runCreateExperiment("react-spa", validTargetName);

		expect(result.status).toBe(0);

		const packageJsonText = readFileSync(
			join(validTarget, "package.json"),
			"utf8",
		);
		const packageJson = JSON.parse(packageJsonText) as {
			name: string;
			scripts: { e2e: string };
		};
		const playwrightConfig = readFileSync(
			join(validTarget, "playwright.config.ts"),
			"utf8",
		);

		expect(packageJsonText).toContain(
			'\n\t"name": "@ts-foundry-experiment/worker-c-react-spa-smoke"',
		);
		expect(packageJson.name).toBe(
			"@ts-foundry-experiment/worker-c-react-spa-smoke",
		);
		expect(packageJson.scripts.e2e).not.toContain(":4175");
		expect(playwrightConfig).not.toContain(":4175");
		expect(packageJson.scripts.e2e).toContain("E2E_PORT=${E2E_PORT:-");
		expect(packageJson.scripts.e2e).toContain("--port $E2E_PORT");
		expect(playwrightConfig).toContain("process.env.E2E_PORT");
		expect(playwrightConfig).toMatch(
			/baseURL: `http:\/\/127\.0\.0\.1:\$\{process\.env\.E2E_PORT \?\? "\d{4,5}"\}`/,
		);
	});
});
