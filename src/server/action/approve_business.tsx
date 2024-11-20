"use server";

import { acceptUserStatus } from "~/server/repository/business_repository";

export async function approveBusinessAction(businessID: number) {
  try {
    const statusResult = await acceptUserStatus(businessID);

    if (statusResult.success) {
      return { status: 200, message: "User status updated successfully" };
    } else {
      return {
        status: 500,
        message: statusResult.error || "Failed to update user status",
      };
    }
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}
