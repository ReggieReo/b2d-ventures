"use server";

import { db } from "~/server/db";
import { media } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import logger from '~/utils/logger';

import {
  getDataroomFiles,
  updateDataroomTypeByMediaURLe,
} from "~/server/repository/media_repository";
import { sendFinancialStatementEmail } from "~/server/action/send_dataroom_email_action";
import { checkRole } from "~/utils/role";

export async function getDataroomFilesAction(businessId: string) {
  return await getDataroomFiles(businessId);
}

export async function deleteDataroomFile(mediaId: string) {
  const user = auth();
  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  await db.delete(media).where(eq(media.mediaID, mediaId));

  return { success: true };
}

export async function updateDataroomFileType(
  mediaURL: string[],
  businessID: string,
) {
  const currentUser = auth();
  if (!currentUser.userId) throw new Error("Unauthorized");
  await updateDataroomTypeByMediaURLe(mediaURL, businessID);
}
export async function approveFinancialStatement(mediaID: string) {
  const currentUser = auth();
  if (!currentUser.userId) throw new Error("Unauthorized");
  checkRole("admin")

  try {
    const mediaRecord = await db.query.media.findFirst({
      where: (model, { eq }) => eq(model.mediaID, mediaID),
    });

    if (!mediaRecord?.userID) {
      throw new Error("Media record or user ID not found");
    }

    await db.update(media).set({ status: 1 }).where(eq(media.mediaID, mediaID));

    // Send approval email
    await sendFinancialStatementEmail(mediaRecord.userID, true);

    return { success: true };
  } catch (error) {
    logger.info({ message: `${currentUser.userId} failed to approve financial statement: ${error}` });
    return { success: false, error: "Failed to approve financial statement" };
  }
}

export async function rejectFinancialStatement(mediaID: string) {
  const currentUser = auth();
  if (!currentUser.userId) throw new Error("Unauthorized");
  checkRole("admin")
  try {
    const mediaRecord = await db.query.media.findFirst({
      where: (model, { eq }) => eq(model.mediaID, mediaID),
    });

    if (!mediaRecord?.userID) {
      throw new Error("Media record or user ID not found");
    }

    await db.update(media).set({ status: 2 }).where(eq(media.mediaID, mediaID));

    // Send rejection email
    await sendFinancialStatementEmail(mediaRecord.userID, false);

    return { success: true };
  } catch (error) {
    logger.info({ message: `${currentUser.userId} failed to reject financial statement: ${error}` });
    return { success: false, error: "Failed to reject financial statement" };
  }
}
