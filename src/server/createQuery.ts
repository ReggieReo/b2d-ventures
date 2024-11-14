"server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import {
  business,
  dataroomRequest,
  investment,
  user,
} from "~/server/db/schema";
import { z } from "zod";
import type { formSchema } from "~/app/create_fundraising/schema";
import { and, eq, relations } from "drizzle-orm";
import { getRequest, getRequestByUserIDAndBusinessID } from "~/server/fetchQuery";

type businessFromSchema = z.infer<typeof formSchema>;

export async function createUserForCurrentUser() {
  // const currentUser = auth();
  const cuser = await currentUser();

  if (!cuser) throw new Error("Unauthorized");

  const userQuery = await db.query.user.findMany({
    where: (model, { eq }) => eq(model.userID, cuser.id),
  });

  if (userQuery.length === 0) {
    console.log("no user");
    await db.insert(user).values({
      userID: cuser.id,
      name: cuser.firstName,
    });
  }
}

export async function createBusiness(businessFromData: businessFromSchema) {
  const currentUser = auth();

  if (!currentUser.userId) throw new Error("Unauthorized");

  return db
    .insert(business)
    .values({
      userID: currentUser.userId,
      company: businessFromData.company,
      slogan: businessFromData.slogan,
      website: businessFromData.website,
      target_fund: businessFromData.target_fund,
      min_investment: businessFromData.min_investment,
      allocation: businessFromData.allocation,
      valuation: businessFromData.valuation,
      deadline: businessFromData.deadline.toISOString(),
      industry: businessFromData.industry,
      problem: businessFromData.problem,
      solution: businessFromData.solution,
      stage: businessFromData.stage,
      team: businessFromData.team,
      investors: businessFromData.investors || "",
    })
    .returning({ id: business.businessID });
}

export async function createDataroomRequest(businessID: number) {
  const currentUser = auth();
  const curUserID = currentUser.userId;

  if (!curUserID) throw new Error("Unauthorized");

  const dataroomQueryResult = await getRequest(businessID);

  if (dataroomQueryResult) throw new Error("Already place a request");

  await db.insert(dataroomRequest).values({
    userID: currentUser.userId,
    businessID: businessID,
  });
}

export async function updateDataroomRequest(
  businessID: number,
  userID: string,
  newStatus: number,
) {
  const currentUser = auth();
  const curUserID = currentUser.userId;

  if (!curUserID) throw new Error("Unauthorized");

  const dataroomQueryResult = await getRequestByUserIDAndBusinessID(userID, businessID);

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

export async function saveInvestment(businessID: number, fund: number) {
  const currentUser = auth();

  if (!currentUser.userId) throw new Error("Unauthorized");

  await db.insert(investment).values({
    userID: currentUser.userId,
    businessID,
    fund,
  });
}
