import { createItem, ItemListResponseSchema } from "@ts-foundry/contracts";
import { Hono } from "hono";

const items = [
	createItem({ name: "Fullstack Alpha" }, 1),
	createItem({ name: "Fullstack Beta" }, 2),
];

export const app = new Hono();

app.get("/api/items", (c) => c.json(ItemListResponseSchema.parse({ items })));
app.get("/api/health", (c) => c.json({ ok: true }));
