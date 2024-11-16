"use server";

import { getTotalInvestmentCurrentMonth } from "~/server/fetchQuery";

export async function fetchTotalInvestmentAction() {
  try {
    const totalInvestment = await getTotalInvestmentCurrentMonth();

    return { status: 200, totalInvestment };
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}
