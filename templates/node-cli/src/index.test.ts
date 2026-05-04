import { describe, expect, it } from "vitest";
import { runCli } from "./index";

describe("node-cli template", () => {
	it("returns a text greeting", () => {
		expect(runCli(["--name", "TypeScript"])).toEqual({
			code: 0,
			output: "Hello, TypeScript!",
		});
	});

	it("returns structured JSON when requested", () => {
		expect(runCli(["--name", "TypeScript", "--json"]).output).toBe(
			'{"message":"Hello, TypeScript!"}',
		);
	});
});
