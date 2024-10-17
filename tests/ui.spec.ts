import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test("request dataroom testing", async ({ page }) => {
  await page.getByText("Start Investing").click();
  await page.waitForURL("**/browse_business");

  await page.waitForTimeout(200);
  await page.getByRole("link", { name: "IP3 Banner IP3 Logo Rento" }).click();
  await page.waitForURL("**/business/1");

  await page.waitForTimeout(200);
  await page.getByText("Request Access to the Dataroom").click();
  await page.waitForTimeout(600);
});

test("invest form testing", async ({ page }) => {
  // Click the get started link.
  await page.getByText("Start Investing").click();
  await page.waitForURL("**/browse_business");

  await page.waitForTimeout(200);
  await page.getByRole("link", { name: "IP3 Banner IP3 Logo Rento" }).click();
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
});

test("create fundraising form testing", async ({ page }) => {
  // Click the get started link.
  await page.getByRole("button", { name: "Start Raising" }).click();
  await page.waitForURL("**/create_fundraising");

  await page.waitForTimeout(100);
  await page.getByPlaceholder("Company Name").fill("Rento");
  await page.waitForTimeout(100);
  await page.getByPlaceholder("CTO").fill("CEO");
  await page.waitForTimeout(100);
  await page
    .getByPlaceholder("https://b2dventures.com")
    .fill("https://rento.com");
  await page.waitForTimeout(100);
  await page.getByText("Select Industry").click();
  await page.waitForTimeout(100);
  await page.getByText("Real Estate").click();
  await page.getByText("Which industry is best").click();
  await page.waitForTimeout(100);
  await page.getByLabel("How much would you like to").fill("70000");
  await page.waitForTimeout(100);
  await page.getByLabel("The minimum check-size per").fill("1000");
  await page.waitForTimeout(100);
  await page.getByLabel("Valuation").fill("500000");
  await page.waitForTimeout(100);
  await page.getByPlaceholder("%").fill("10");
  await page.waitForTimeout(100);
  await page.getByText("Pick a date").click();
  await page.waitForTimeout(100);
  await page.getByRole("gridcell", { name: "31" }).click();
  await page.waitForTimeout(100);
  await page.getByText("Submit").click();
  await page.waitForURL("**");
  await page.waitForTimeout(500);
});
