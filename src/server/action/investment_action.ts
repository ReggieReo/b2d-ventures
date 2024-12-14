"use server";
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

  const validatedFields = schemaForDB.safeParse({
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    logger.error({ errors: validatedFields.error.flatten().fieldErrors }, "Validation errors");
    return { success: false, error: "Failed to validate fields" };
  }

  logger.info()
  await createInvestment(businessID, validatedFields.data.amount);
}

export async function fetchRecentInvestmentsInCurrentWeekAction() {
  try {
    const recentInvestments = await getRecentInvestmentsInCurrentWeek();
    logger.info({ recentInvestments }, "Recent investments data");

    return { status: 200, recentInvestments };
  } catch (error) {
    logger.error({ error }, "Server action error");
    return { success: false, error: "Failed to get recent investments" };
  }
}

export async function fetchTotalInvestmentCurrentWeekAction() {
  try {
    const totalInvestment = await getTotalInvestmentCurrentWeek();
    return { status: 200, totalInvestment };
  } catch (error) {
    logger.error({ error }, "Server action error");
    return { success: false, error: "Failed to get total investment" };
  }
}

export async function fetchTotalInvestmentByMonthAction() {
  try {
    const totalInvestmentByMonth = await getTotalInvestmentByMonth();

    return { status: 200, totalInvestmentByMonth };
  } catch (error) {
    logger.error({ error }, "Server action error");
    return { success: false, error: "Failed to get investment by month" };
  }
}
