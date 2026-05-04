import { describe, expect, it } from "vitest";
import { CreateItemSchema, createItem, ItemListResponseSchema } from "./index";

describe("contracts", () => {
	it("trims item names at the API boundary", () => {
		expect(CreateItemSchema.parse({ name: "  Alpha  " })).toEqual({
			name: "Alpha",
		});
	});

	it("rejects empty item names", () => {
		expect(() => CreateItemSchema.parse({ name: "   " })).toThrow(
			"name is required",
		);
	});

	it("creates deterministic item ids for examples", () => {
		expect(createItem({ name: "Alpha" }, 1)).toEqual({
			id: "item-1",
			name: "Alpha",
			completed: false,
		});
	});

	it("validates list responses", () => {
		const response = ItemListResponseSchema.parse({
			items: [createItem({ name: "Alpha" }, 1)],
		});

		expect(response.items).toHaveLength(1);
	});
});
