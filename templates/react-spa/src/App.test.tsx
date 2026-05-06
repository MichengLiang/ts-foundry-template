import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("web app", () => {
	it("renders the React SPA UI foundation path", async () => {
		render(<App />);

		expect(
			await screen.findByRole("heading", {
				name: "React workspace hello world",
			}),
		).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: "Item name" })).toBeVisible();
		expect(screen.getByRole("button", { name: "Create item" })).toBeVisible();
		expect(await screen.findByRole("link", { name: "Alpha" })).toBeVisible();
		expect(screen.getByRole("button", { name: "Toggle theme" })).toBeVisible();
	});

	it("creates a new item through the default stack", async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.type(
			await screen.findByRole("textbox", { name: "Item name" }),
			"Gamma",
		);
		await user.click(screen.getByRole("button", { name: "Create item" }));

		expect(await screen.findByRole("link", { name: "Gamma" })).toBeVisible();
	});
});
