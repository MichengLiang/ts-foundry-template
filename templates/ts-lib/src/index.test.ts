import { describe, expect, it } from "vitest";
import { createGreeting } from "./index";

describe("ts-lib template", () => {
	it("exports a typed hello world function", () => {
		expect(createGreeting({ name: " TypeScript " })).toBe("Hello, TypeScript!");
	});
});
