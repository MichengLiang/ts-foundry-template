import {
	CreateItemSchema,
	createItem,
	ItemListResponseSchema,
} from "@ts-foundry/contracts";
import { Hono } from "hono";

const items = [
	createItem({ name: "Alpha" }, 1),
	createItem({ name: "Beta" }, 2),
];

export const app = new Hono();

app.get("/health", (c) => c.json({ ok: true }));

app.get("/items", (c) => {
	return c.json(ItemListResponseSchema.parse({ items }));
});

app.get("/items/:id", (c) => {
	const item = items.find((candidate) => candidate.id === c.req.param("id"));

	if (!item) {
		return c.json(
			{ error: { code: "not_found", message: "Item not found" } },
			404,
		);
	}

	return c.json(item);
});

app.post("/items", async (c) => {
	const body = await c.req.json().catch(() => undefined);
	const parsed = CreateItemSchema.safeParse(body);

	if (!parsed.success) {
		return c.json(
			{
				error: {
					code: "invalid_body",
					message: "Request body failed validation",
					issues: parsed.error.issues,
				},
			},
			400,
		);
	}

	const item = createItem(parsed.data, items.length + 1);
	items.push(item);

	return c.json(item, 201);
});
