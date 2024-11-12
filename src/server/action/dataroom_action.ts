"use server";

import { db } from "~/server/db";
import { media } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { getDataroomFiles } from "../fetchQuery";
import { updateDataroomTypeByMediaURLe } from "../updateQuery";

export async function getDataroomFilesAction(businessId: number) {
  return await getDataroomFiles(businessId);
}

export async function deleteDataroomFile(mediaId: number) {
  const user = auth();
  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  await db.delete(media)
    .where(eq(media.mediaID, mediaId));
  
  return { success: true };
}

export async function updateDataroomFileType(mediaURL: string[], businessID: number) {
  await updateDataroomTypeByMediaURLe(mediaURL, businessID);
}