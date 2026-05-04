import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("fullstack server", () => {
	it("serves contract-shaped item responses", async () => {
		const response = await app.request("/api/items");
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.items[0].name).toBe("Fullstack Alpha");
	});
});
