import { z } from "zod";

export const ItemSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	completed: z.boolean(),
});

export const CreateItemSchema = z.object({
	name: z.string().trim().min(1, "name is required"),
});

export const ItemListResponseSchema = z.object({
	items: z.array(ItemSchema),
});

export const ApiErrorSchema = z.object({
	error: z.object({
		code: z.string().min(1),
		message: z.string().min(1),
		issues: z.unknown().optional(),
	}),
});

export type Item = z.infer<typeof ItemSchema>;
export type CreateItemInput = z.infer<typeof CreateItemSchema>;
export type ItemListResponse = z.infer<typeof ItemListResponseSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;

export function createItem(input: CreateItemInput, index: number): Item {
	const data = CreateItemSchema.parse(input);

	return {
		id: `item-${index}`,
		name: data.name,
		completed: false,
	};
}
