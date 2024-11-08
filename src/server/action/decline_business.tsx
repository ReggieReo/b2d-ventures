"use server";

import { declineUserStatus } from "~/server/fetchQuery";

export async function declineBusinessAction(businessID: number) {
  try {
    const statusResult = await declineUserStatus(businessID);

    if (statusResult.success) {
      return { status: 200, message: "User status updated to 'declined' successfully" };
    } else {
      return { status: 500, message: statusResult.error || "Failed to update user status" };
    }
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}
