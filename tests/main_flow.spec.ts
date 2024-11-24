import { test, expect, Page } from "@playwright/test";
import { db } from "~/server/db";
import { business, media } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { setupClerkTestingToken, clerk } from '@clerk/testing/playwright'

// Test suite for the complete business investment flow
test.describe("Business Investment Flow", () => {
    test.describe.configure({ mode: 'serial' });

  const TEST_COMPANY = {
    name: "Test Company",
    website: "https://test.com",
    valuation: "500000",
    allocation: "10",
    targetFunding: "70000",
    minCheckSize: "1000"
  };

  const TEST_CARD = {
    number: "4242 4242 4242 4242",
    expirationDate: "12/25",
    cvv: "123"
  };


  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });


  async function logIn(page: Page, role: string) {
    await setupClerkTestingToken({ page })
    let identifier: string;
    switch (role) {
      case "admin": identifier = "user1+clerk_test@example.com"; break;
      default: identifier = "user2+clerk_test@example.com"; break;
    }
    await clerk.signIn({
            page,
        signInParams: { strategy: 'email_code', identifier: identifier },
    })
  }

  // Test 1: Create Business -> manual
  test("should create a new business", async ({ page }) => {
    await logIn(page, "user");
    // Start fundraising process
    await page.getByRole("button", { name: "Start Raising" }).click();
    await page.waitForURL("**/create_fundraising");

    // Fill basic information
    await page.getByPlaceholder("Company Name").fill("Test Company");
    await page.getByPlaceholder('A brief, compelling').fill("Revolutionizing the future of real estate investment");
    await page.getByPlaceholder('https://www.yourcompany.com').fill("https://test.com");
    
    // Select industry
    await page.getByText("Select Industry").click();
    await page.getByText("Real Estate").click();
    
    // Fill financial details
    await page.getByLabel("Valuation").fill("500000");
    await page.getByPlaceholder("%").fill("10");
    await page.getByPlaceholder('Minimum 10 shares').fill("10");
    
    // Set deadline
    await page.getByLabel('Fundraising Deadline').click();
    await page.getByLabel('Go to next month').click();
    await page.getByRole("gridcell", { name: "29" }).click();

    // Upload required files - create promises just before each upload
    
    // Upload media images
    const fileChooserPromiseMedia = page.waitForEvent('filechooser');
    await page.locator('[id="\\:rc\\:-form-item"]').getByText('Choose File(s)').click();
    const fileChooserMedia = await fileChooserPromiseMedia;
    await fileChooserMedia.setFiles('test-files/test2.jpg');
    await expect(page.getByText('test2.jpg')).toBeVisible({timeout: 10000});

    // Upload logo
    const fileChooserPromiseLogo = page.waitForEvent('filechooser');
    await page.locator('[id="\\:rd\\:-form-item"]').getByText('Choose File').click();
    const fileChooserLogo = await fileChooserPromiseLogo;  
    await fileChooserLogo.setFiles('test-files/img-test.webp');
    await expect(page.getByText('img-test.webp')).toBeVisible({timeout: 10000});

    // Upload banner
    const fileChooserPromiseBanner = page.waitForEvent('filechooser');
    await page.locator('[id="\\:re\\:-form-item"]').getByText('Choose File').click();
    const fileChooserBanner = await fileChooserPromiseBanner;
    await fileChooserBanner.setFiles('test-files/img-test.webp');
    await expect(page.getByText('img-test.webp')).toBeVisible({timeout: 10000});

    // Upload dataroom documents
    const fileChooserPromiseDataroom = page.waitForEvent('filechooser');
    await page.locator('[id="\\:rf\\:-form-item"]').getByText('Choose File(s)').click();
    const fileChooserDataroom = await fileChooserPromiseDataroom;
    await fileChooserDataroom.setFiles([
      'test-files/Financial-Statements.pdf',
      'test-files/Financial-Marketing-Plan.pdf'
    ]);
    await expect(page.getByText('Financial-Statements.pdf')).toBeVisible({timeout: 10000});
    await expect(page.getByText('Financial-Marketing-Plan.pdf')).toBeVisible({timeout: 10000});

    // Fill pitch sections
    await page.locator('form div').filter({ hasText: 'ProblemClearly describe the' }).getByRole('paragraph').nth(1).fill(`
      The real estate market lacks transparency and accessibility for small investors.
      High entry barriers prevent many potential investors from participating.
      Complex regulations and paperwork create friction in the investment process.
    `);

    await page.locator('form div').filter({ hasText: 'SolutionExplain how your' }).getByRole('paragraph').nth(1).fill(`
      Our platform democratizes real estate investment through:
      - Fractional ownership model
      - Automated compliance checks
      - User-friendly interface
      - Transparent pricing and fees
    `);

    await page.locator('form div').filter({ hasText: 'StageDetail your current' }).getByRole('paragraph').nth(1).fill(`
      Seed stage startup with:
      - MVP launched
      - 100 beta users
      - $50k monthly recurring revenue
      - Strategic partnerships with 3 major real estate firms
    `);

    await page.locator('form div').filter({ hasText: 'TeamIntroduce your team' }).getByRole('paragraph').nth(1).fill(`
      - CEO: John Doe - 15 years in PropTech
      - CTO: Jane Smith - Ex-Google, Stanford CS
      - COO: Mike Johnson - Former RE Investment Manager
      - Head of Legal: Sarah Brown - Securities Law Expert
    `);

    await page.locator('form div').filter({ hasText: 'Investors (Optional)List any' }).getByRole('paragraph').nth(1).fill(`
      - Angel Investor Group A: $200k
      - PropTech Ventures: $300k
      - Industry mentors and advisors from leading RE companies
    `);

    // Submit and verify
    await page.getByRole("button", { name: "Submit" }).click();
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL(/\/startup_dashboard/);
    await expect(page.getByText("Under Review")).toBeVisible();
    await page.getByText("View Business Page").click();

    // Store business ID
    const businessData = await db.select().from(business).where(eq(business.userID, process.env.PLAYWRIGHT_TEST_USER_ID!));
    const testBusinessId = businessData[0]!.businessID;
    await page.waitForURL("**/business/"+testBusinessId);
  });

  // Test 2: Admin Approval Process
  test("should approve business listing", async ({ page }) => {
    await logIn(page, "admin");
    await page.goto("http://localhost:3000/admin");
    
    await page.getByText("Fundraising").click();
    await page.waitForURL("**/admin/fund");

    // Set up dialog handler before triggering the action
    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe(`Are you sure you want to approve the campaign for ${TEST_COMPANY.name}?`);
      await dialog.accept();
    });

    // Find and approve the business
    const rows = page.getByRole('row');
    const companyNameCell = page.getByRole('cell', { name: TEST_COMPANY.name }).first();
    const row = await companyNameCell.locator('xpath=ancestor::tr');
    await row.getByRole("button", { name: "Approve" }).click();

    await expect(page.getByText(TEST_COMPANY.name)).not.toBeVisible();

    await page.goto("/browse_business");
    await expect(page.getByRole("link", { name: TEST_COMPANY.name })).toBeVisible();
  });

  // Test 3: Upload Financial Statement
  test("should upload financial statement", async ({ page }) => {
    await logIn(page, "user");
    await page.goto("http://localhost:3000/investment_portfolio");
    
    // Prepare test file
    const filePath = 'test-files/Financial-Statements.pdf';
    const fileInput = await page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    
    // Upload and verify
    await expect(page.getByText("Your financial statement is pending review by our administrators. We'll notify you once it's approved.")).toBeVisible();
  });

  test("approve financial statement", async ({ page }) => {
    await logIn(page, "admin");
    await page.goto("http://localhost:3000/admin");
    await page.getByText("Financial Statements").click();
    await page.waitForURL("**/admin/financial_statement");
    // get row by user id
    const userRow = page.getByRole("row").filter({ hasText: process.env.PLAYWRIGHT_TEST_USER_ID! });
    await userRow.getByRole("button", { name: "Approve" }).click();
  })

  // Test 4: Investment Process
  test("should complete investment process", async ({ page }) => {
    await logIn(page, "user");

    // Navigate to investment page
    await page.getByText("Start Investing").click();
    await page.waitForURL("**/browse_business");
    
    // Select business and start investment
    await page.getByRole("link", { name: TEST_COMPANY.name }).click();
    await page.getByRole("button", { name: `Invest in ${TEST_COMPANY.name}` }).click();
    const businessID = await db.select().from(business).where(eq(business.userID, process.env.PLAYWRIGHT_TEST_USER_ID!));
    await page.waitForURL("**/create_investment/"+businessID[0]!.businessID);
    
    // Fill payment details
    await page.getByPlaceholder("Card number").fill(TEST_CARD.number);
    await page.getByPlaceholder("MM/YY").fill(TEST_CARD.expirationDate);
    await page.getByPlaceholder("CVV").fill(TEST_CARD.cvv);
    await page.locator('#terms').click();
    
    // Complete investment
    await page.getByRole("button", { name: "Confirm investment" }).click();
    await expect(page).toHaveURL(/\/startup_dashboard/);
    await expect(page.getByText(TEST_COMPANY.name)).toBeVisible();
  });

  // Test 5: Dataroom Access Flow
  test("should handle dataroom access flow", async ({ page }) => {
    const businessID = await db.select().from(business).where(eq(business.userID, process.env.PLAYWRIGHT_TEST_USER_ID!));
    // Request access
    await logIn(page, "admin");
    await page.getByText("Start Investing").click();
    await page.waitForURL("**/browse_business");
    await page.getByRole("link", { name: TEST_COMPANY.name }).click();
    await page.getByRole("button", { name: "Request Access to the Dataroom" }).click();
    
    // Verify request sent
    await expect(page.getByText("Data room request has been sent")).toBeVisible();
    
    await clerk.signOut({ page })
    // Admin approval

    await logIn(page, "user");
    await page.goto("http://localhost:3000/startup_dashboard");
    await page.getByText("Pending").click();
    await page.getByText("Accept").click();
    await clerk.signOut({ page })

    await logIn(page, "admin");
    // Verify access granted
    await page.goto("http://localhost:3000/business/"+businessID[0]!.businessID);
    await expect(page.getByRole("button", { name: "Access Dataroom" })).toBeVisible();
  });

});