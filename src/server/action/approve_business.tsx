"use server";

import { db } from "~/server/db";
import { business } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function approveBusiness(businessID: number) {
  try {
    await db
      .update(business)
      .set({ approve: true })
      .where(eq(business.businessID, businessID))
      .execute();
    return { success: true };
  } catch (error) {
    console.error("Error approving business:", error);
    return { success: false, error: "Failed to approve business" };
  }
}
