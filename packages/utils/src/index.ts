export function formatTitle(value: string): string {
	return value
		.trim()
		.replace(/\s+/g, " ")
		.replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}

export function invariant(
	condition: unknown,
	message: string,
): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}
