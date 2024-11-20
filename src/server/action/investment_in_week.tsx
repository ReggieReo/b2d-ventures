"use server";

import { getTotalInvestmentCurrentWeek } from "~/server/fetchQuery";

export async function fetchTotalInvestmentCurrentWeekAction() {
  try {
    const totalInvestment = await getTotalInvestmentCurrentWeek();
    return { status: 200, totalInvestment };
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}
