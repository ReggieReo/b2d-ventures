import "server-only";
import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import { business, investment } from "~/server/db/schema";
import { eq, inArray } from "drizzle-orm";
import { industries } from "~/utils/enum/industryList";
import { desc, asc } from "drizzle-orm";
// user client -> ship js to the client but code still on the server
// user server -> expose endpoint to the client
// running on the server

export async function getUser() {
  return db.query.user.findMany();
}

export async function getUserByID(id: string) {
  return db.query.user.findFirst({
    where: (model, { eq }) => eq(model.userID, id),
  });
}

export async function getAllImages() {
  return db.query.media.findMany();
}

export async function getAllBusiness() {
  return db.query.business.findMany();
}

export async function getInvestmentByBusinessID(businessID: number) {
  return db.query.investment.findMany({
    where: (model, { eq }) => eq(model.businessID, businessID),
  });
}

export async function getInvestmentByUserID(userID: string) {
  return db.query.investment.findMany({
    where: (model, { eq }) => eq(model.userID, userID),
    with: {
      business: true,
    },
  });
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

export async function getImageByBusinessID(businessID: number) {
  return db.query.media.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.businessID, businessID), eq(model.type, "image")),
  });
}

export async function getLogoByBusinessID(businessID: number) {
  return db.query.media.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.businessID, businessID), eq(model.type, "logo")),
  });
}

export async function getRequest(businessID: number) {
  const curUserID = auth().userId;
  if (!curUserID) throw new Error("Unauthorized");

  return db.query.dataroomRequest.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.userID, curUserID), eq(model.businessID, businessID)),
  });
}

export async function getRequestByUserIDAndBusinessID(
  userID: string,
  businessID: number,
) {
  if (!userID) throw new Error("Unauthorized");

  return db.query.dataroomRequest.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.userID, userID), eq(model.businessID, businessID)),
  });
}

export async function getRequestByID(businessID: number) {
  return db.query.dataroomRequest.findMany({
    where: (model, { eq }) => eq(model.businessID, businessID),
    with: {
      user: true,
    },
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

export async function getPendingBusinesses() {
  return db.query.business.findMany({
    where: (model, { eq }) => eq(model.business_status, 0),
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
        gte(model.deadline, today),
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

export async function getBusinessByUserIDExplicit(userID: string) {
  return db.query.business.findFirst({
    where: (model, { eq }) => eq(model.userID, userID),
  });
}

export async function getDataroomFiles(businessID: number) {
  return db.query.media.findMany({
    where: (model, { eq, and }) =>
      and(eq(model.businessID, businessID), eq(model.type, "dataroom")),
  });
}
