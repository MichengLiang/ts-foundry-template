export type GreetingInput = {
	name: string;
};

export function createGreeting(input: GreetingInput): string {
	return `Hello, ${input.name.trim()}!`;
}
