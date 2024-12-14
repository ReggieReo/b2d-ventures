import { z } from "zod";
import { db } from "~/server/db";
import { business } from "~/server/db/schema";
import { asc, desc, eq, inArray } from "drizzle-orm";
import type { formSchema } from "~/app/create_fundraising/schema";
import { auth } from "@clerk/nextjs/server";
import { industries } from "~/utils/enum/industryList";
import { calculateStockPrice } from "~/utils/util";
import logger from '~/utils/logger';

("server-only");

export async function acceptUserStatus(businessID: string) {
  try {
    await db
      .update(business)
      .set({ business_status: 1 })
      .where(eq(business.businessID, businessID));
    return { success: true };
  } catch (error) {
    logger.error({ error }, "Error updating user status");
    return { success: false, error: "Failed to update user status" };
  }
}

export async function declineUserStatus(businessID: string) {
  try {
    await db
      .update(business)
      .set({ business_status: 2 })
      .where(eq(business.businessID, businessID));
    return { success: true };
  } catch (error) {
    logger.error({ error }, "Error updating user status");
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

export async function getBusinessByID(businessID: string) {
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

  // Handle special sorting cases
  switch (sortMethod) {
    case "no_investor":
      return result.sort((a, b) => {
        return orderMethod === "asc"
          ? a.investment.length - b.investment.length
          : b.investment.length - a.investment.length;
      });

    case "remaining_stocks":
      return result.sort((a, b) => {
        const getRemaining = (business: typeof result[0]) => {
          const totalInvested = business.investment.reduce((sum, inv) => sum + inv.fund, 0);
          return business.target_stock! - totalInvested;
        };
        const remainingA = getRemaining(a);
        const remainingB = getRemaining(b);
        return orderMethod === "asc" 
          ? remainingA - remainingB 
          : remainingB - remainingA;
      });

    case "amount_invest":
      return result.sort((a, b) => {
        const getTotalInvested = (business: typeof result[0]) => {
          return business.investment.reduce((sum, inv) => sum + inv.fund, 0);
        };
        const investedA = getTotalInvested(a);
        const investedB = getTotalInvested(b);
        return orderMethod === "asc" 
          ? investedA - investedB 
          : investedB - investedA;
      });

    case "min_invest":
      return result.sort((a, b) => {
        const getStockPrice = (business: typeof result[0]) => {
          return calculateStockPrice(
            business.valuation!,
            business.target_stock!,
            business.allocation!,
          );
        };
        const priceA = getStockPrice(a);
        const priceB = getStockPrice(b);
        return orderMethod === "asc" 
          ? priceA - priceB 
          : priceB - priceA;
      });

    default:
      return result;
  }
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
