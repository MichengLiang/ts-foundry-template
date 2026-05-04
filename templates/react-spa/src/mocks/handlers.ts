import { createItem } from "@ts-foundry/contracts";
import { HttpResponse, http } from "msw";

let items = [createItem({ name: "Alpha" }, 1), createItem({ name: "Beta" }, 2)];

export const handlers = [
	http.get("*/api/items", () => HttpResponse.json({ items })),
	http.post("*/api/items", async ({ request }) => {
		const body = (await request.json()) as { name?: string };
		const item = createItem({ name: body.name ?? "" }, items.length + 1);
		items = [...items, item];

		return HttpResponse.json(item, { status: 201 });
	}),
];
