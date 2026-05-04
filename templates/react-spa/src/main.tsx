import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";

async function enableMocks() {
	if (import.meta.env.DEV) {
		const { worker } = await import("./mocks/browser");
		await worker.start({ onUnhandledRequest: "bypass" });
	}
}

await enableMocks();

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root element not found");
}

createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
