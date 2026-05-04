import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("web app", () => {
	it("loads items and creates a new item through the default stack", async () => {
		const user = userEvent.setup();
		render(<App />);

		expect(await screen.findByText("Alpha")).toBeInTheDocument();

		await user.type(screen.getByLabelText("Item name"), "Gamma");
		await user.click(screen.getByRole("button", { name: "Create item" }));

		expect(await screen.findByText("Gamma")).toBeInTheDocument();
	});
});
