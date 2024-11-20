"use server";

import { getTotalInvestmentByMonth } from "~/server/repository/investment_repository";

export async function fetchTotalInvestmentByMonthAction() {
  try {
    const totalInvestmentByMonth = await getTotalInvestmentByMonth();

    return { status: 200, totalInvestmentByMonth };
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}
