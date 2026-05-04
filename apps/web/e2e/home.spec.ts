import { expect, test } from "@playwright/test";

test("runs the React hello world path", async ({ page }) => {
	await page.goto("/");
	await expect(
		page.getByRole("heading", { name: "React workspace hello world" }),
	).toBeVisible();
	await expect(page.getByRole("link", { name: "Alpha" })).toBeVisible();
	await page.getByLabel("Item name").fill("Gamma");
	await page.getByRole("button", { name: "Create item" }).click();
	await expect(page.getByRole("link", { name: "Gamma" })).toBeVisible();
});
