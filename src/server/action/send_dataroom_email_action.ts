"use server";

import { Resend } from "resend";
import {
  EmailTemplate,
  FinancialStatementApprovalEmail,
  FinancialStatementRejectionEmail,
  InvestmentNotificationEmail,
  BusinessApprovalEmail,
} from "~/components/util/email_template";
import { clerkClient } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { getBusinessByID } from "~/server/repository/business_repository";
import { calculateStockPrice } from "~/utils/util";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDataroomApprovalEmail(
  userID: string,
  businessID: string,
) {
  try {
    // Verify current user has permission to send this email
    const cUser = await currentUser();
    if (!cUser) {
      throw new Error("Unauthorized");
    }

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
      // to: [user.emailAddresses[0]?.emailAddress ?? ""],
      to: "steam.reaw1@gmail.com",
      subject: `Dataroom Access Approved for ${business.company}`,
      react: EmailTemplate({
        firstName: user.firstName ?? "Investor",
        companyName: business.company ?? "the company",
        dataroomLink: dataroomLink,
      }) as React.ReactElement,
    });
    return { success: true, data };
  } catch (error) {
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

    // Get user details
    const user = await clerkClient().users.getUser(userID);
    if (!user) {
      throw new Error("User not found");
    }

    // Send email based on approval status
    const data = await resend.emails.send({
      from: "B2D Venture <b2dventure-noreply@resend.dev>",
      // to: [user.emailAddresses[0]?.emailAddress ?? ""],
      to: "steam.reaw1@gmail.com",
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

    return { success: true, data };
  } catch (error) {
    console.error("Error sending financial statement email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

export async function sendInvestmentNotificationEmail(
  businessOwnerID: string,
  businessID: string,
  investorName: string,
  stockAmount: number,
) {
  try {
    // Verify current user has permission to send this email
    const cUser = await currentUser();
    if (!cUser) {
      throw new Error("Unauthorized");
    }

    // Get business owner and business details
    const businessOwner = await clerkClient().users.getUser(businessOwnerID);
    const business = await getBusinessByID(businessID);

    if (!businessOwner || !business) {
      throw new Error("Business owner or business not found");
    }

    // Calculate investment details
    const stockPrice = calculateStockPrice(
      business.valuation!,
      business.target_stock!,
      business.allocation!,
    );
    const totalInvestment = stockPrice * stockAmount;

    // Send email
    const data = await resend.emails.send({
      from: "B2D Venture <b2dventure-noreply@resend.dev>",
      // to: [businessOwner.emailAddresses[0]?.emailAddress ?? ""],
      to: "steam.reaw1@gmail.com",
      subject: `New Investment in ${business.company}`,
      react: InvestmentNotificationEmail({
        firstName: businessOwner.firstName ?? "Business Owner",
        companyName: business.company ?? "your business",
        investorName: investorName,
        stockAmount: stockAmount,
        stockPrice: stockPrice,
        totalInvestment: totalInvestment,
      }) as React.ReactElement,
    });

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

export async function sendBusinessApprovalEmail(
  businessOwnerID: string,
  businessID: string,
) {
  try {
    // Verify current user has permission to send this email
    const cUser = await currentUser();
    if (!cUser) {
      throw new Error("Unauthorized");
    }

    // Get business owner and business details
    const businessOwner = await clerkClient().users.getUser(businessOwnerID);
    const business = await getBusinessByID(businessID);

    if (!businessOwner || !business) {
      throw new Error("Business owner or business not found");
    }

    // Send email
    const data = await resend.emails.send({
      from: "B2D Venture <b2dventure-noreply@resend.dev>",
      // to: [businessOwner.emailAddresses[0]?.emailAddress ?? ""],
      to: "steam.reaw1@gmail.com",
      subject: `Your Business Listing for ${business.company} is Approved`,
      react: BusinessApprovalEmail({
        firstName: businessOwner.firstName ?? "Business Owner",
        companyName: business.company ?? "your business",
      }) as React.ReactElement,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Error sending business approval email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
