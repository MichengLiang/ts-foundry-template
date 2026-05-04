import { describe, expect, it } from "vitest";
import { createExampleItems, createSeededFaker } from "./index";

describe("test-utils", () => {
	it("creates deterministic faker output", () => {
		const first = createSeededFaker(42).commerce.productName();
		const second = createSeededFaker(42).commerce.productName();

		expect(first).toBe(second);
	});

	it("creates contract-valid example items", () => {
		expect(createExampleItems(2)).toHaveLength(2);
		expect(createExampleItems(1)[0]?.id).toBe("item-1");
	});
});
