"use server";
import { auth } from "@clerk/nextjs/server";
import { schemaForDB } from "~/app/create_investment/schema";
import {
  createInvestment,
  getRecentInvestmentsInCurrentWeek,
  getTotalInvestmentByMonth,
  getTotalInvestmentCurrentWeek,
} from "~/server/repository/investment_repository";
import logger from '~/utils/logger';

export async function createInvestmentAction(
  businessID: string,
  formData: FormData,
) {
  "use server";
  const currentUser = auth();
  if (!currentUser.userId) throw new Error("Unauthorized");

  const validatedFields = schemaForDB.safeParse({
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    logger.error({message: `Validation errors: ${JSON.stringify(validatedFields.error.flatten().fieldErrors)}`});
    return { success: false, error: "Failed to validate fields" };
  }

  logger.info({message: `${currentUser.userId} creating investment for business ${businessID} `});
  await createInvestment(businessID, validatedFields.data.amount);
}

export async function fetchRecentInvestmentsInCurrentWeekAction() {
  try {
    const recentInvestments = await getRecentInvestmentsInCurrentWeek();
    logger.info({message: `Recent investments data: ${JSON.stringify(recentInvestments)}`});

    return { status: 200, recentInvestments };
  } catch (error) {
    logger.error({message: `Server action error: ${error}`});
    return { success: false, error: "Failed to get recent investments" };
  }
}

export async function fetchTotalInvestmentCurrentWeekAction() {
  try {
    const totalInvestment = await getTotalInvestmentCurrentWeek();
    return { status: 200, totalInvestment };
  } catch (error) {
    logger.error({message: `Server action error: ${error}`});
    return { success: false, error: "Failed to get total investment" };
  }
}

export async function fetchTotalInvestmentByMonthAction() {
  try {
    const totalInvestmentByMonth = await getTotalInvestmentByMonth();

    return { status: 200, totalInvestmentByMonth };
  } catch (error) {
    logger.error({message: `Server action error: ${error}`});
    return { success: false, error: "Failed to get investment by month" };
  }
}
