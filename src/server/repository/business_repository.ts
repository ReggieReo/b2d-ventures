import { z } from "zod";
import { db } from "~/server/db";
import { business } from "~/server/db/schema";
import { asc, desc, eq, inArray } from "drizzle-orm";
import type { formSchema } from "~/app/create_fundraising/schema";
import { auth } from "@clerk/nextjs/server";
import { industries } from "~/utils/enum/industryList";

("server-only");

export async function acceptUserStatus(businessID: number) {
  try {
    await db
      .update(business)
      .set({ business_status: 1 })
      .where(eq(business.businessID, businessID));
    return { success: true };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, error: "Failed to update user status" };
  }
}

export async function declineUserStatus(businessID: number) {
  try {
    await db
      .update(business)
      .set({ business_status: 2 })
      .where(eq(business.businessID, businessID));
    return { success: true };
  } catch (error) {
    console.error("Error updating user status:", error);
    return { success: false, error: "Failed to update user status" };
  }
}

type businessFromSchema = z.infer<typeof formSchema>;

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
      target_stock: businessFromData.target_stock,
      allocation: businessFromData.allocation,
      valuation: businessFromData.valuation,
      deadline: businessFromData.deadline.toISOString(),
      industry: businessFromData.industry,
      problem: businessFromData.problem,
      solution: businessFromData.solution,
      stage: businessFromData.stage,
      team: businessFromData.team,
      investors: businessFromData.investors ?? "",
    })
    .returning({ id: business.businessID });
}

export async function getAllBusiness() {
  return db.query.business.findMany();
}

export async function getBusinessByID(businessID: number) {
  return db.query.business.findFirst({
    where: (model, { eq }) => eq(model.businessID, businessID),
  });
}

export async function getBusinessByIndustries(industry: string[]) {
  return db.query.business.findMany({
    where: (model, { inArray }) => inArray(model.industry, industry),
  });
}

export async function getBusinessByUserID() {
  // Return the business from the business owner ID
  const userID = auth().userId;

  if (!userID) throw new Error("Unauthorized");

  return db.query.business.findFirst({
    where: (model, { eq }) => eq(model.userID, userID),
  });
}

export async function getAcceptedBusinesses() {
  return db.query.business.findMany({
    where: (model, { eq }) => eq(model.business_status, 1),
  });
}

export async function getAcceptBusinessesByKeyData(
  searchKeyword: string,
  currentPage: number,
  businessesPerPage: number,
  industry: string[],
  sortMethod: string,
  orderMethod: string,
) {
  // Return a get business according to the search keyword, industry and sorting

  if (industry.length === 0) {
    industry = industries.map((ind) => ind.value);
  }

  let sortBy;
  if (sortMethod === "created") {
    sortBy = business.createdAt;
  } else if (sortMethod === "deadline") {
    sortBy = business.deadline;
  } else {
    sortBy = business.createdAt;
  }

  let orderBy;
  if (orderMethod === "asc") {
    orderBy = asc;
  } else if (orderMethod === "desc") {
    orderBy = desc;
  } else {
    orderBy = desc;
  }
  // TODO: Implement sorting by remaining stock
  // TODO: Implement sorting by stocks invested
  // TODO: Implement sorting by min stocks investment

  const today = new Date();

  const result = await db.query.business.findMany({
    where: (model, { and, ilike, eq, gte }) =>
      and(
        and(
          and(
            ilike(model.company, `%${searchKeyword}%`),
            eq(model.business_status, 1),
          ),
          inArray(model.industry, industry),
        ),
        gte(model.deadline, today.toISOString()),
      ),
    limit: businessesPerPage,
    offset: (currentPage - 1) * businessesPerPage,
    orderBy: orderBy(sortBy),
    with: {
      investment: true,
    },
  });

  if (sortMethod === "no_investor") {
    return result.sort((a, b) => {
      return orderMethod === "asc"
        ? a.investment.length - b.investment.length
        : b.investment.length - a.investment.length;
    });
  }
  return result;
}

export async function getBusinessByUserIDExplicit(userID: string) {
  return db.query.business.findFirst({
    where: (model, { eq }) => eq(model.userID, userID),
  });
}

export async function getPendingBusinesses() {
  return db.query.business.findMany({
    where: (model, { eq }) => eq(model.business_status, 0),
  });
}
