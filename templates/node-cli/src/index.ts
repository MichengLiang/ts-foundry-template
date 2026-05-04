#!/usr/bin/env node

export type CliResult = {
	code: number;
	output: string;
};

export function runCli(args: string[]): CliResult {
	const json = args.includes("--json");
	const nameIndex = args.indexOf("--name");
	const name = nameIndex >= 0 ? args[nameIndex + 1] : undefined;

	if (!name) {
		return {
			code: 1,
			output: json
				? JSON.stringify({ error: "name is required" })
				: "name is required",
		};
	}

	const message = `Hello, ${name}!`;

	return {
		code: 0,
		output: json ? JSON.stringify({ message }) : message,
	};
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const result = runCli(process.argv.slice(2));
	console.log(result.output);
	process.exitCode = result.code;
}
