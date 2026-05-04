import {
	CreateItemSchema,
	ItemListResponseSchema,
	ItemSchema,
} from "@ts-foundry/contracts";

export async function fetchItems() {
	const response = await fetch("/api/items");

	if (!response.ok) {
		throw new Error("Failed to load items");
	}

	return ItemListResponseSchema.parse(await response.json()).items;
}

export async function createRemoteItem(name: string) {
	const input = CreateItemSchema.parse({ name });
	const response = await fetch("/api/items", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(input),
	});

	if (!response.ok) {
		throw new Error("Failed to create item");
	}

	return ItemSchema.parse(await response.json());
}
