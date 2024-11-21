"use server";
import { schemaForDB } from "~/app/create_investment/schema";
import {
  createInvestment,
  getRecentInvestmentsInCurrentWeek,
  getTotalInvestmentByMonth,
  getTotalInvestmentCurrentWeek,
} from "~/server/repository/investment_repository";

export async function createInvestmentAction(
  businessID: number,
  formData: FormData,
) {
  "use server";

  const validatedFields = schemaForDB.safeParse({
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await createInvestment(businessID, validatedFields.data.amount);
}

export async function fetchRecentInvestmentsInCurrentWeekAction() {
  try {
    const recentInvestments = await getRecentInvestmentsInCurrentWeek();
    console.log("Recent investments data:", recentInvestments);

    return { status: 200, recentInvestments };
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}

export async function fetchTotalInvestmentCurrentWeekAction() {
  try {
    const totalInvestment = await getTotalInvestmentCurrentWeek();
    return { status: 200, totalInvestment };
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}

export async function fetchTotalInvestmentByMonthAction() {
  try {
    const totalInvestmentByMonth = await getTotalInvestmentByMonth();

    return { status: 200, totalInvestmentByMonth };
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}
