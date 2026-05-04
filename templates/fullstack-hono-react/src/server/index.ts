import { resolve } from "node:path";
import { serve } from "@hono/node-server";
import { createApp } from "./app";

const port = Number.parseInt(process.env.PORT ?? "3001", 10);
const staticRoot = process.env.STATIC_ROOT ?? resolve(process.cwd(), "dist");
const app = createApp({ staticRoot });

serve({ fetch: app.fetch, port }, (info) => {
	console.log(`Fullstack API listening on http://localhost:${info.port}`);
});
