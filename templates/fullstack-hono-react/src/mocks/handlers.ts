import { createItem } from "@ts-foundry/contracts";
import { HttpResponse, http } from "msw";

export const handlers = [
	http.get("*/api/items", () =>
		HttpResponse.json({
			items: [
				createItem({ name: "Fullstack Alpha" }, 1),
				createItem({ name: "Fullstack Beta" }, 2),
			],
		}),
	),
];
