import "server-only";
import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import { business, investment, user } from "~/server/db/schema";
import { eq, inArray, desc, asc } from "drizzle-orm";
import { industries } from "~/utils/enum/industryList";
import { format, parseISO } from "date-fns";
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

export async function getBannerByBusinessID(businessID: number) {
  return db.query.media.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.businessID, businessID), eq(model.type, "banner")),
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

export async function getTotalInvestmentCurrentMonth() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const result = await db.query.investment.findMany({
    where: (model, { and, gte, lte }) =>
      and(
        gte(model.createdAt, startOfMonth),
        lte(model.createdAt, endOfMonth)
      ),
    columns: {
      fund: true,
    },
  });

  const totalInvestment = result.reduce((sum, record) => sum + record.fund, 0);

  return totalInvestment;
}

export async function getTotalInvestmentCurrentWeek() {
  const now = new Date();
  const startOfWeek = new Date(
    now.setDate(now.getDate() - now.getDay() + 1)
  );
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const result = await db.query.investment.findMany({
    where: (model, { and, gte, lte }) =>
      and(
        gte(model.createdAt, startOfWeek),
        lte(model.createdAt, endOfWeek)
      ),
    columns: {
      fund: true,
    },
  });

  const totalInvestment = result.reduce((sum, record) => sum + record.fund, 0);

  return totalInvestment;
}

export async function getTotalInvestmentByMonth() {
  try {
    const investments = await db
      .select({
        createdAt: investment.createdAt,
        fund: investment.fund,
      })
      .from(investment)
      .orderBy(asc(investment.createdAt));

    // Group and sum investments by month
    const investmentByMonth = investments.reduce((acc, current) => {
      const monthKey = format(parseISO(current.createdAt.toISOString()), 'yyyy-MM'); // Format the date as YYYY-MM

      if (!acc[monthKey]) {
        acc[monthKey] = 0;
      }
      acc[monthKey] += current.fund;

      return acc;
    }, {} as Record<string, number>);

    // Convert the result to an array format with full month names
    const result = Object.entries(investmentByMonth).map(([month, totalInvestment]) => {
      const date = new Date(month + "-01");
      const fullMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

      return {
        month: fullMonthName, // Display full month name
        totalInvestment,
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching total investment by month:", error);
    throw new Error("Failed to fetch total investment by month");
  }
}

export async function getMostRecentInvestment() {
  try {
    const result = await db.query.investment.findMany({
      columns: {
        fund: true,
        createdAt: true,
      },
      with: {
        user: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: desc(investment.createdAt),
      limit: 10,
    });

    if (!result || result.length === 0 || !result[0] || !result[0].user) {
      return {
        message: "No recent investments found or user data is missing.",
      };
    }

    const recentInvestment = result[0];
    const userName = recentInvestment.user ? recentInvestment.user.name : "Unknown User";

    return {
      userName,
      amount: recentInvestment.fund,
      date: recentInvestment.createdAt,
    };
  } catch (error) {
    console.error("Error fetching most recent investment:", error);
    throw new Error("Failed to fetch most recent investment");
  }
}
