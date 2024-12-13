"server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { dataroomRequest } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function getRequestByBusinessID(businessID: string) {
  const curUserID = auth().userId;
  if (!curUserID) throw new Error("Unauthorized");

  return db.query.dataroomRequest.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.userID, curUserID), eq(model.businessID, businessID)),
  });
}

export async function getRequestByUserIDAndBusinessID(
  userID: string,
  businessID: string,
) {
  if (!userID) throw new Error("Unauthorized");

  return db.query.dataroomRequest.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.userID, userID), eq(model.businessID, businessID)),
  });
}

export async function getRequestByIDWithUser(businessID: string) {
  return await db.query.dataroomRequest.findMany({
    where: (model, { eq }) => eq(model.businessID, businessID),
    with: {
      user: {
        with: {
          media: {
            where: (media, { eq }) => eq(media.type, "financial_statement"),
          },
        },
      },
    },
  });
}

export async function createDataroomRequest(businessID: string) {
  const currentUser = auth();
  const curUserID = currentUser.userId;

  if (!curUserID) throw new Error("Unauthorized");

  const dataroomQueryResult = await getRequestByBusinessID(businessID);

  if (dataroomQueryResult) throw new Error("Already place a request");

  await db.insert(dataroomRequest).values({
    userID: currentUser.userId,
    businessID: businessID,
  });
}

export async function updateDataroomRequest(
  businessID: string,
  userID: string,
  newStatus: number,
) {
  const currentUser = auth();
  const curUserID = currentUser.userId;

  if (!curUserID) throw new Error("Unauthorized");

  const dataroomQueryResult = await getRequestByUserIDAndBusinessID(
    userID,
    businessID,
  );

  if (!dataroomQueryResult) throw new Error("No request was found");

  await db
    .update(dataroomRequest)
    .set({ requestStatus: newStatus })
    .where(
      and(
        eq(dataroomRequest.userID, userID),
        eq(dataroomRequest.businessID, businessID),
      ),
    );
}
