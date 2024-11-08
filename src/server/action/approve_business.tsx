"use server";

import { approveBusiness } from "~/server/fetchQuery";

export async function approveBusinessAction(businessID: number) {
  try {
    const result = await approveBusiness(businessID);

    if (result.success) {
      return { status: 200, message: "Business approved successfully" };
    } else {
      return { status: 500, message: result.error || "Approval failed" };
    }
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}
