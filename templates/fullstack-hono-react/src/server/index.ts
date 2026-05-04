import { serve } from "@hono/node-server";
import { app } from "./app";

const port = Number.parseInt(process.env.PORT ?? "3001", 10);

serve({ fetch: app.fetch, port }, (info) => {
	console.log(`Fullstack API listening on http://localhost:${info.port}`);
});
