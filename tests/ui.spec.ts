import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});
test("invest form testing", async ({ page }) => {
  // Click the get started link.
  await page.getByText("Start Investing").click();
  await page.waitForURL("**/browse_buisiness");

  await page.waitForTimeout(200);
  await page.getByText("Rento").click();
  await page.waitForURL("**/business/1");

  await page.waitForTimeout(200);
  await page.getByRole("button", { name: "Invest in Rento" }).click();
  await page.waitForURL("**/investform");

  await page.getByText("Card").click();

  await page.waitForTimeout(200);
  await page.getByPlaceholder("Card number").fill("4242 4242 4242 4242");
  await page.waitForTimeout(200);
  await page.getByPlaceholder("ZIP code").fill("44000");
  await page.waitForTimeout(200);

  await page.getByRole("checkbox").click();

  await page.getByText("Confirm investment").click();
  await page.waitForURL("**/investor_portfolio");
  await page.waitForTimeout(1000);
  // Expects page to have a heading with the name of Installation.
  // await expect(page.getByText("Ventures")).toBeVisible();
});
