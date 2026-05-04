import { describe, expect, it } from "vitest";
import { parseBooleanEnv, resolveFromWorkspace } from "./index";

describe("node-utils", () => {
	it("resolves paths from an explicit workspace root", () => {
		expect(resolveFromWorkspace("/workspace", "apps/web")).toBe(
			"/workspace/apps/web",
		);
	});

	it("parses explicit true environment flags", () => {
		expect(parseBooleanEnv("true")).toBe(true);
		expect(parseBooleanEnv("1")).toBe(true);
		expect(parseBooleanEnv("false")).toBe(false);
		expect(parseBooleanEnv(undefined)).toBe(false);
	});
});
