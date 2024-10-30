import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import {business, dataroomRequest, investment, user} from "~/server/db/schema";
import { z } from "zod";
import type { formSchema } from "~/app/create_fundraising/schema";
import { relations } from "drizzle-orm";
import {findRequest} from "~/server/fetchQuery";

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

  await db.insert(business).values({
    userID: currentUser.userId,
    company: businessFromData.company,
    title: businessFromData.title,
    website: businessFromData.website,
    target_fund: businessFromData.target_fund,
    min_investment: businessFromData.min_investment,
    allocation: businessFromData.allocation,
    valuation: businessFromData.valuation,
    deadline: businessFromData.deadline.toISOString(),
    industry: businessFromData.industry,
  });
}

export async function createDataroomRequest(businessID: number) {
  const currentUser = auth();
  const curUserID = currentUser.userId

  if (!curUserID) throw new Error("Unauthorized");

  const dataroomQueryResult = await findRequest(curUserID, businessID);

  if (dataroomQueryResult) throw new Error("Already place a request")

  await db.insert(dataroomRequest).values({
    userID: currentUser.userId,
    businessID: businessID,
  });
}
