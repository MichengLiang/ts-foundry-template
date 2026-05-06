import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("fullstack app", () => {
	it("renders data described by shared contracts with the UI foundation", async () => {
		render(<App />);

		expect(
			screen.getByRole("heading", { name: "Fullstack contract hello world" }),
		).toBeVisible();
		expect(await screen.findByText("Fullstack Alpha")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Toggle theme" })).toBeVisible();
		expect(
			screen.getByRole("region", { name: "Notifications alt+T" }),
		).toBeVisible();
	});
});
