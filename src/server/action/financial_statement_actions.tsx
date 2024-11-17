"use server";

import { db } from "~/server/db";
import { media } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { sendFinancialStatementEmail } from "~/server/action/send_dataroom_email_action";

export async function approveFinancialStatement(mediaID: number) {
  try {
    const mediaRecord = await db.query.media.findFirst({
      where: (model, { eq }) => eq(model.mediaID, mediaID)
    });

    if (!mediaRecord?.userID) {
      throw new Error("Media record or user ID not found");
    }

    await db
      .update(media)
      .set({ status: 1 })
      .where(eq(media.mediaID, mediaID));

    // Send approval email
    await sendFinancialStatementEmail(mediaRecord.userID, true);
    
    return { success: true };
  } catch (error) {
    console.error("Error approving financial statement:", error);
    return { success: false, error: "Failed to approve financial statement" };
  }
}

export async function rejectFinancialStatement(mediaID: number) {
  try {
    const mediaRecord = await db.query.media.findFirst({
      where: (model, { eq }) => eq(model.mediaID, mediaID)
    });

    if (!mediaRecord?.userID) {
      throw new Error("Media record or user ID not found");
    }

    await db
      .update(media)
      .set({ status: 2 })
      .where(eq(media.mediaID, mediaID));

    // Send rejection email
    await sendFinancialStatementEmail(mediaRecord.userID, false);
    
    return { success: true };
  } catch (error) {
    console.error("Error rejecting financial statement:", error);
    return { success: false, error: "Failed to reject financial statement" };
  }
} 