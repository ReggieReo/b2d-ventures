"use server";

import { getRecentInvestmentsInCurrentWeek } from "~/server/repository/investment_repository";

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
