import { describe, expect, it } from "vitest";
import { formatTitle, invariant } from "./index";

describe("utils", () => {
	it("normalizes whitespace before title casing", () => {
		expect(formatTitle("  hello   typeScript  ")).toBe("Hello TypeScript");
	});

	it("throws invariant failures with the provided message", () => {
		expect(() => invariant(false, "expected value")).toThrow("expected value");
	});
});
