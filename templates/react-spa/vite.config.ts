import type { IncomingMessage, ServerResponse } from "node:http";
import tailwindcss from "@tailwindcss/vite";
import { createItem } from "@ts-foundry/contracts";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
	response.statusCode = statusCode;
	response.setHeader("content-type", "application/json");
	response.end(JSON.stringify(body));
}

async function readJson(request: IncomingMessage) {
	const chunks: Buffer[] = [];

	for await (const chunk of request) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}

	return JSON.parse(Buffer.concat(chunks).toString("utf8")) as {
		name?: string;
	};
}

function previewApiPlugin(): Plugin {
	let items = [
		createItem({ name: "Alpha" }, 1),
		createItem({ name: "Beta" }, 2),
	];

	return {
		name: "preview-api",
		configurePreviewServer(server) {
			server.middlewares.use("/api/items", async (request, response, next) => {
				if (request.method === "GET") {
					sendJson(response, 200, { items });
					return;
				}

				if (request.method === "POST") {
					let body: { name?: string };

					try {
						body = await readJson(request);
					} catch {
						sendJson(response, 400, { error: "Invalid JSON" });
						return;
					}

					const item = createItem({ name: body.name ?? "" }, items.length + 1);
					items = [...items, item];
					sendJson(response, 201, item);
					return;
				}

				next();
			});
		},
	};
}

export default defineConfig({
	plugins: [react(), tailwindcss(), previewApiPlugin()],
});
