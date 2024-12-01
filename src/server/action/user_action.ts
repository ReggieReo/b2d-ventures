"use server";

import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function updatePrivacyConsent(consent: boolean) {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await db
    .update(user)
    .set({ privacy: consent })
    .where(eq(user.userID, userId));

  return { success: true };
} 