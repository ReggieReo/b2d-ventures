"server-only";

import { db } from "~/server/db";
import { media } from "~/server/db/schema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function updateMediaImageTypeByMediaURLe(
  mediaURL: string[],
  businessID: string,
) {
  await db
    .update(media)
    .set({
      businessID,
      type: "image",
    })
    .where(inArray(media.url, mediaURL));
}

export async function updateMediaLogoTypeByMediaURLe(
  mediaURL: string,
  businessID: string,
) {
  await db
    .update(media)
    .set({
      businessID,
      type: "logo",
    })
    .where(eq(media.url, mediaURL));
}

export async function updateMediaBannerTypeByMediaURLe(
  mediaURL: string,
  businessID: string,
) {
  await db
    .update(media)
    .set({
      businessID,
      type: "banner",
    })
    .where(eq(media.url, mediaURL));
}

export async function updateDataroomTypeByMediaURLe(
  mediaURL: string[],
  businessID: string,
) {
  await db
    .update(media)
    .set({
      businessID,
      type: "dataroom",
    })
    .where(inArray(media.url, mediaURL));
}

export async function getAllImages() {
  return db.query.media.findMany();
}

export async function getImageByBusinessID(businessID: string) {
  return db.query.media.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.businessID, businessID), eq(model.type, "image")),
  });
}

export async function getLogoByBusinessID(businessID: string) {
  return db.query.media.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.businessID, businessID), eq(model.type, "logo")),
  });
}

export async function getBannerByBusinessID(businessID: string) {
  return db.query.media.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.businessID, businessID), eq(model.type, "banner")),
  });
}

export async function getDataroomFiles(businessID: string) {
  return db.query.media.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.businessID, businessID), eq(model.type, "dataroom")),
  });
}

export async function getFinancialStatement(businessID: string) {
  const user = auth();
  if (!user) throw new Error("Unauthorized");
  return db.query.media.findFirst({
    where: (model, { eq, and }) =>
      and(
        eq(model.type, "financial_statement"),
        eq(model.userID, user.userId!),
      ),
  });
}

export async function getPendingFinancialStatements() {
  return db.query.media.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.type, "financial_statement"), eq(model.status, 0)),
    orderBy: (model, { desc }) => [desc(model.createdAt)],
  });
}

export async function getFirstMediaByTypeAndUserID(
  type: string,
  userID: string,
) {
  return db.query.media.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.type, type), eq(model.userID, userID)),
  });
}
