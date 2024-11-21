"use server";

import { Resend } from "resend";
import {
  EmailTemplate,
  FinancialStatementApprovalEmail,
  FinancialStatementRejectionEmail,
} from "~/components/util/email_template";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByID } from "~/server/repository/user_repository";
import { getBusinessByID } from "~/server/repository/business_repository";

const resend = new Resend(process.env.RESEND_API_KEY);

// TODO: check if admin again
export async function sendDataroomApprovalEmail(
  userID: string,
  businessID: number,
) {
  try {
    // Verify current user has permission to send this email
    const cUser = await currentUser();
    if (!cUser) {
      throw new Error("Unauthorized");
    }

    console.log("Sending dataroom approval email to userID: ", userID);
    // Get user and business details
    const user = await clerkClient().users.getUser(userID);
    const business = await getBusinessByID(businessID);

    if (!user || !business) {
      throw new Error("User or business not found");
    }

    // Generate dataroom link
    const dataroomLink = `${process.env.NEXT_PUBLIC_APP_URL}/dataroom/${businessID}`;

    console.log(
      "Sending email to: ",
      user.emailAddresses[0]?.emailAddress ?? "",
    );
    // Send email
    const data = await resend.emails.send({
      from: "B2D Venture <b2dventure-noreply@resend.dev>",
      to: [user.emailAddresses[0]?.emailAddress ?? ""],
      subject: `Dataroom Access Approved for ${business.company}`,
      react: EmailTemplate({
        firstName: user.firstName ?? "Investor",
        companyName: business.company ?? "the company",
        dataroomLink: dataroomLink,
      }) as React.ReactElement,
    });
    console.log(data);
    console.log("Email sent successfully");
    return { success: true, data };
  } catch (error) {
    console.error("Error sending dataroom approval email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

export async function sendFinancialStatementEmail(
  userID: string,
  isApproved: boolean,
) {
  try {
    // Verify current user has permission to send this email
    const cUser = await currentUser();
    if (!cUser) {
      throw new Error("Unauthorized");
    }

    console.log(
      `Sending financial statement ${isApproved ? "approval" : "rejection"} email to userID: `,
      userID,
    );

    // Get user details
    const user = await clerkClient().users.getUser(userID);
    if (!user) {
      throw new Error("User not found");
    }

    console.log(
      "Sending email to: ",
      user.emailAddresses[0]?.emailAddress ?? "",
    );

    // Send email based on approval status
    const data = await resend.emails.send({
      from: "B2D Venture <b2dventure-noreply@resend.dev>",
      to: [user.emailAddresses[0]?.emailAddress ?? ""],
      subject: isApproved
        ? "Your Financial Statement has been Approved"
        : "Financial Statement Review Update",
      react: isApproved
        ? (FinancialStatementApprovalEmail({
            firstName: user.firstName ?? "Investor",
          }) as React.ReactElement)
        : (FinancialStatementRejectionEmail({
            firstName: user.firstName ?? "Investor",
          }) as React.ReactElement),
    });

    console.log(data);
    console.log("Email sent successfully");
    return { success: true, data };
  } catch (error) {
    console.error("Error sending financial statement email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
