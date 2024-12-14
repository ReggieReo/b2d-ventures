"server-only";

import { endOfWeek, format, parseISO, startOfWeek } from "date-fns";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { business, investment, user } from "~/server/db/schema";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { sendInvestmentNotificationEmail } from "~/server/action/send_dataroom_email_action";
import { getBusinessByID } from "./business_repository";
import logger from '~/utils/logger';

export async function createInvestment(businessID: string, fund: number) {
  const currentUser = auth();

  if (!currentUser.userId) throw new Error("Unauthorized");

  // Get business details to find owner
  const business = await getBusinessByID(businessID);
  if (!business) throw new Error("Business not found");

  // Create the investment
  await db.insert(investment).values({
    userID: currentUser.userId,
    businessID,
    fund,
  });

  // Get investor details
  const investor = await clerkClient().users.getUser(currentUser.userId);
  if (!investor) throw new Error("Investor not found");

  // Send notification email to business owner
  await sendInvestmentNotificationEmail(
    business.userID!,
    businessID,
    `${investor.firstName} ${investor.lastName}`,
    fund,
  );
}

export async function getInvestmentByBusinessID(businessID: string) {
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

export async function getTotalInvestmentCurrentMonth() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const result = await db.query.investment.findMany({
    where: (model, { and, gte, lte }) =>
      and(gte(model.createdAt, startOfMonth), lte(model.createdAt, endOfMonth)),
    columns: {
      fund: true,
    },
  });

  const totalInvestment = result.reduce((sum, record) => sum + record.fund, 0);

  return totalInvestment;
}

export async function getTotalInvestmentCurrentWeek() {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const result = await db.query.investment.findMany({
    where: (model, { and, gte, lte }) =>
      and(gte(model.createdAt, startOfWeek), lte(model.createdAt, endOfWeek)),
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
    const investmentByMonth = investments.reduce(
      (acc, current) => {
        const monthKey = format(
          parseISO(current.createdAt.toISOString()),
          "yyyy-MM",
        ); // Format the date as YYYY-MM

        if (!acc[monthKey]) {
          acc[monthKey] = 0;
        }
        acc[monthKey] += current.fund;

        return acc;
      },
      {} as Record<string, number>,
    );

    // Convert the result to an array format with full month names
    const result = Object.entries(investmentByMonth).map(
      ([month, totalInvestment]) => {
        const date = new Date(month + "-01");
        const fullMonthName = new Intl.DateTimeFormat("en-US", {
          month: "long",
        }).format(date);

        return {
          month: fullMonthName, // Display full month name
          totalInvestment,
        };
      },
    );

    return result;
  } catch (error) {
    logger.error({message: `Error fetching total investment by month: ${error}`});
    throw error;
  }
}

export async function getRecentInvestmentsInCurrentWeek() {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

  return db
    .select({
      name: user.name,
      fund: investment.fund,
      createdAt: investment.createdAt,
      allocation: business.allocation,
      valuation: business.valuation,
      businessName: business.company,
    })
    .from(investment)
    .innerJoin(user, eq(investment.userID, user.userID))
    .innerJoin(business, eq(investment.businessID, business.businessID))
    .where(
      and(
        gte(investment.createdAt, startDate),
        lte(investment.createdAt, endDate),
      ),
    )
    .orderBy(desc(investment.createdAt));
}
