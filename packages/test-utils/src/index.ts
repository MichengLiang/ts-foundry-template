import { faker } from "@faker-js/faker";
import { createItem } from "@ts-foundry/contracts";
import { HttpResponse, http } from "msw";

export function createSeededFaker(seed = 20260504): typeof faker {
	faker.seed(seed);
	return faker;
}

export function createExampleItems(count = 3) {
	const seeded = createSeededFaker();

	return Array.from({ length: count }, (_, index) =>
		createItem({ name: seeded.commerce.productName() }, index + 1),
	);
}

export function createItemHandlers(baseUrl = "/api") {
	return [
		http.get(`${baseUrl}/items`, () => {
			return HttpResponse.json({ items: createExampleItems() });
		}),
		http.post(`${baseUrl}/items`, async ({ request }) => {
			const body = (await request.json()) as { name?: string };
			return HttpResponse.json(createItem({ name: body.name ?? "" }, 99), {
				status: 201,
			});
		}),
	];
}
