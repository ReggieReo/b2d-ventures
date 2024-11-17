"use server";

import { getMostRecentInvestment } from "~/server/fetchQuery";

export async function fetchMostRecentInvestmentAction() {
    try {
      const mostRecentInvestment = await getMostRecentInvestment();
      console.log("Most recent investment data:", mostRecentInvestment);
  
      return { status: 200, mostRecentInvestment };
    } catch (error) {
      console.error("Server action error:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
  
