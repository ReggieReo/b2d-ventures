"use server";

import { approveBusiness, acceptUserStatus } from "~/server/fetchQuery";

export async function approveBusinessAction(businessID: number) {
  try {
    const approvalResult = await approveBusiness(businessID);

    if (approvalResult.success) {
      const statusResult = await acceptUserStatus(businessID);

      if (statusResult.success) {
        return { status: 200, message: "Business approved and user status updated successfully" };
      } else {
        return { status: 500, message: statusResult.error || "Failed to update user status" };
      }
    } else {
      return { status: 500, message: approvalResult.error || "Approval failed" };
    }
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}
