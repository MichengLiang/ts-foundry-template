import { expect, test } from "@playwright/test";

test("runs the React hello world UI foundation path", async ({ page }) => {
	await page.goto("/");
	await expect(
		page.getByRole("heading", { name: "React workspace hello world" }),
	).toBeVisible();
	await expect(page.getByRole("link", { name: "Alpha" })).toBeVisible();

	await page.getByLabel("Item name").fill("Gamma");
	await page.getByRole("button", { name: "Create item" }).click();
	await expect(page.getByRole("link", { name: "Gamma" })).toBeVisible();
	await expect(page.getByText("Created Gamma")).toBeVisible();

	await page.getByRole("button", { name: "Toggle theme" }).click();
	await page.getByRole("menuitem", { name: "Dark" }).click();
	await expect(page.locator("html")).toHaveClass(/dark/);

	await page.getByRole("link", { name: "Gamma" }).click();
	await expect(page).toHaveURL(/\/items\/item-3$/);
	await expect(page.getByRole("heading", { name: "Gamma" })).toBeVisible();
	await expect(page.getByText("Route parameter: item-3")).toBeVisible();
	await page.getByRole("link", { name: "Back" }).click();
	await expect(
		page.getByRole("heading", { name: "React workspace hello world" }),
	).toBeVisible();
});
