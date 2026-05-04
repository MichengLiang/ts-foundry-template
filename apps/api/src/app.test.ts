import { describe, expect, it } from "vitest";
import { z } from "zod";
import { app } from "./app";

const ItemsBodySchema = z.object({
	items: z.array(z.object({ id: z.string() })),
});

describe("api", () => {
	it("reports health", async () => {
		const response = await app.request("/health");

		expect(response.status).toBe(200);
		await expect(response.json()).resolves.toEqual({ ok: true });
	});

	it("returns contract-shaped items", async () => {
		const response = await app.request("/items");
		const body = ItemsBodySchema.parse(await response.json());

		expect(response.status).toBe(200);
		expect(body.items.at(0)?.id).toBe("item-1");
	});

	it("rejects invalid create payloads", async () => {
		const response = await app.request("/items", {
			method: "POST",
			body: JSON.stringify({ name: " " }),
			headers: { "content-type": "application/json" },
		});

		expect(response.status).toBe(400);
	});
});
