import { serveStatic } from "@hono/node-server/serve-static";
import { createItem, ItemListResponseSchema } from "@ts-foundry/contracts";
import { Hono } from "hono";

type CreateAppOptions = {
	staticRoot?: string;
};

export function createApp(options: CreateAppOptions = {}) {
	const app = new Hono();
	let items = [
		createItem({ name: "Fullstack Alpha" }, 1),
		createItem({ name: "Fullstack Beta" }, 2),
	];

	app.get("/api/items", (c) => c.json(ItemListResponseSchema.parse({ items })));
	app.post("/api/items", async (c) => {
		const body = (await c.req.json()) as { name?: string };
		const item = createItem({ name: body.name ?? "" }, items.length + 1);
		items = [...items, item];

		return c.json(item, 201);
	});
	app.get("/api/health", (c) => c.json({ ok: true }));
	app.all("/api/*", (c) => c.json({ error: "Not found" }, 404));

	if (options.staticRoot) {
		app.use("*", serveStatic({ root: options.staticRoot }));
		app.get("*", serveStatic({ path: "index.html", root: options.staticRoot }));
	}

	return app;
}

export const app = createApp();
