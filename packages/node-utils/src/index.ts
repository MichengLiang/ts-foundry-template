import { resolve } from "node:path";

export function resolveFromWorkspace(
	cwd: string,
	relativePath: string,
): string {
	return resolve(cwd, relativePath);
}

export function parseBooleanEnv(value: string | undefined): boolean {
	return value === "1" || value === "true";
}
