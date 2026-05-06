import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import { Button } from "./components/button";
import { Card, CardContent } from "./components/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./components/form";
import { Input } from "./components/input";
import { ModeToggle } from "./mode-toggle";
import { ThemeProvider } from "./theme-provider";

function ComposedForm() {
	const form = useForm<{ name: string }>({ defaultValues: { name: "" } });

	return (
		<Form {...form}>
			<form>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Item name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}

describe("UI foundation components", () => {
	it("renders a button label", () => {
		render(<Button>Save</Button>);

		expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
	});

	it("supports a button variant", () => {
		render(<Button variant="secondary">Cancel</Button>);

		expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass(
			"bg-secondary",
		);
	});

	it("renders input through an accessible composed form label", () => {
		render(<ComposedForm />);

		expect(
			screen.getByRole("textbox", { name: "Item name" }),
		).toBeInTheDocument();
	});

	it("renders card content", () => {
		render(
			<Card>
				<CardContent>Shared content</CardContent>
			</Card>,
		);

		expect(screen.getByText("Shared content")).toBeInTheDocument();
	});

	it("renders the mode toggle trigger", () => {
		render(
			<ThemeProvider>
				<ModeToggle />
			</ThemeProvider>,
		);

		expect(
			screen.getByRole("button", { name: "Toggle theme" }),
		).toBeInTheDocument();
	});
});
