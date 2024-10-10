import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import { user, business } from "~/server/db/schema";
import { type formSchema } from "~/app/create_fundraising/schema";
import { z } from "zod";
import "server-only";

// user client -> ship js to the client but code still on the server
// user server -> expose endpoint to the client
// running on the server

export async function getUser() {
  return db.query.user.findMany();
}
export async function getAllImages() {
  return db.query.media.findMany();
}

export async function createUserForCurrentUser() {
  const currentUser = auth();

  if (!currentUser.userId) throw new Error("Unauthorized");

  const userQuery = await db.query.user.findMany({
    where: (model, { eq }) => eq(model.userID, currentUser.userId),
  });

  if (userQuery.length === 0) {
    console.log("no user");
    await db.insert(user).values({
      userID: currentUser.userId,
    });
  }
}
type businessFromSchema = z.infer<typeof formSchema>;
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
