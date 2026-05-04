import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("fullstack app", () => {
	it("renders data described by shared contracts", async () => {
		render(<App />);

		expect(await screen.findByText("Fullstack Alpha")).toBeInTheDocument();
	});
});
