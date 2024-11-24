import { test as teardown } from '@playwright/test';
import { eq } from 'drizzle-orm';
import { business, investment, media, dataroomRequest } from '~/server/db/schema';
import { db } from '~/server/db';

async function deleteDatabase(userID: string) {
  await db.delete(business).where(eq(business.userID, userID));
  await db.delete(media).where(eq(media.userID, userID));
  await db.delete(investment).where(eq(investment.userID, userID));
  await db.delete(dataroomRequest).where(eq(dataroomRequest.userID, userID));
}
teardown('delete database', async ({ }) => {
  await deleteDatabase(process.env.PLAYWRIGHT_TEST_USER_ID!);
  await deleteDatabase(process.env.PLAYWRIGHT_TEST_ADMIN_ID!);
});
