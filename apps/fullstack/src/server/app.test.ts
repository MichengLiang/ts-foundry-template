import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { app, createApp } from "./app";

const staticRoot = join(process.cwd(), "tmp", "preview-server-test");

afterEach(async () => {
	await rm(staticRoot, { force: true, recursive: true });
});

describe("fullstack server", () => {
	it("serves contract-shaped item responses", async () => {
		const response = await app.request("/api/items");
		const body = await response.json();

		expect(response.status).toBe(200);
		expect(body.items[0].name).toBe("Fullstack Alpha");
	});

	it("creates items through the server API", async () => {
		const app = createApp();
		const createResponse = await app.request("/api/items", {
			body: JSON.stringify({ name: "Fullstack Gamma" }),
			headers: { "content-type": "application/json" },
			method: "POST",
		});
		const listResponse = await app.request("/api/items");
		const body = await listResponse.json();

		expect(createResponse.status).toBe(201);
		expect((await createResponse.json()).name).toBe("Fullstack Gamma");
		expect(body.items.map((item: { name: string }) => item.name)).toContain(
			"Fullstack Gamma",
		);
	});

	it("serves built client routes without turning API routes into HTML", async () => {
		await mkdir(join(staticRoot, "assets"), { recursive: true });
		await writeFile(
			join(staticRoot, "index.html"),
			"<html>Preview shell</html>",
		);
		await writeFile(
			join(staticRoot, "assets", "app.js"),
			"console.log('preview');",
		);

		const previewApp = createApp({ staticRoot });
		const apiResponse = await previewApp.request("/api/items", {
			headers: { accept: "text/html" },
		});
		const missingApiResponse = await previewApp.request("/api/missing");
		const shellResponse = await previewApp.request("/dashboard");

		expect(apiResponse.status).toBe(200);
		expect(apiResponse.headers.get("content-type")).toContain(
			"application/json",
		);
		expect((await apiResponse.json()).items[0].name).toBe("Fullstack Alpha");
		expect(missingApiResponse.status).toBe(404);
		expect(missingApiResponse.headers.get("content-type")).toContain(
			"application/json",
		);
		expect(shellResponse.status).toBe(200);
		expect(shellResponse.headers.get("content-type")).toContain("text/html");
		expect(await shellResponse.text()).toContain("Preview shell");
	});
});
