"use server";

import {
  acceptUserStatus,
  createBusiness,
  declineUserStatus,
} from "~/server/repository/business_repository";
import { formSchema } from "~/app/create_fundraising/schema";
import {
  updateDataroomTypeByMediaURLe,
  updateMediaBannerTypeByMediaURLe,
  updateMediaImageTypeByMediaURLe,
  updateMediaLogoTypeByMediaURLe,
} from "~/server/repository/media_repository";
import { getBusinessByID } from "~/server/repository/business_repository";
import { sendBusinessApprovalEmail } from "~/server/action/send_dataroom_email_action";
import logger from '~/utils/logger';
import { auth } from "@clerk/nextjs/server";
import { checkRole } from "~/utils/role";

export async function approveBusinessAction(businessID: string) {
  const currentUser = auth();
  if (!currentUser.userId) throw new Error("Unauthorized");
  checkRole("admin")
  try {
    // Get business details before updating status
    const business = await getBusinessByID(businessID);
    if (!business) {
      throw new Error("Business not found");
    }

    const statusResult = await acceptUserStatus(businessID);

    if (statusResult.success) {
      // Send approval notification email
      await sendBusinessApprovalEmail(business.userID!, businessID);
      return { status: 200, message: "Business approved and notification sent" };
    } else {
      return {
        status: 500,
        message: statusResult.error ?? "Failed to update business status",
      };
    }
  } catch (error) {
    logger.error({message: `Server action error: ${error}`});
    return { status: 500, message: "Internal server error" };
  }
}

export async function createFundraising(formData: FormData) {
  logger.info({message: `${auth().userId} creating fundraising with form data: ${JSON.stringify(formData)}`});
  // Parse JSON strings for media and logo
  let mediaData: unknown[] = [];
  let logoData: unknown = null;
  let bannerData: unknown = null;
  let dataroomData: unknown[] = [];

  try {
    const mediaString = formData.get("media");
    if (mediaString && typeof mediaString === "string") {
      mediaData = JSON.parse(mediaString) as unknown[];
    }

    const logoString = formData.get("logo");
    if (logoString && typeof logoString === "string") {
      logoData = JSON.parse(logoString);
    }

    const bannerString = formData.get("banner");
    if (bannerString && typeof bannerString === "string") {
      bannerData = JSON.parse(bannerString);
    }

    const dataroomString = formData.get("dataroom");
    if (dataroomString && typeof dataroomString === "string") {
      dataroomData = JSON.parse(dataroomString) as unknown[];
    }
  } catch (error) {
    logger.error({message: `Error parsing JSON data: ${error}`});
    return { success: false, error: "Failed to parse JSON data" };
  }

  // Validate the form data with parsed JSON values
  const validatedFields = formSchema.safeParse({
    company: formData.get("company"),
    slogan: formData.get("slogan"),
    website: formData.get("website"),
    target_stock: formData.get("target_stock"),
    allocation: formData.get("allocation"),
    valuation: formData.get("valuation"),
    deadline: formData.get("deadline"),
    email: formData.get("email"),
    industry: formData.get("industry"),
    media: mediaData, // Use parsed media array
    logo: logoData, // Use parsed logo object
    banner: bannerData,
    dataroom: dataroomData, // Use parsed dataroom array
    problem: formData.get("problem"),
    solution: formData.get("solution"),
    stage: formData.get("stage"),
    team: formData.get("team"),
    investors: formData.get("investors"),
  });

  if (!validatedFields.success) {
    logger.error({message: `Validation errors: ${JSON.stringify(validatedFields.error.flatten())}`});
    return { success: false, error: "Failed to validate fields" };
  }

  logger.info({message: `Validated fields: ${JSON.stringify(validatedFields.data)}`});
  try {
    // Uncomment this when ready to create business
    const id = await createBusiness(validatedFields.data);
    await updateMediaImageTypeByMediaURLe(
      validatedFields.data.media.map((m) => m.url),
      id[0]!.id,
    );
    await updateMediaLogoTypeByMediaURLe(
      validatedFields.data.logo.url,
      id[0]!.id,
    );
    await updateMediaBannerTypeByMediaURLe(
      validatedFields.data.banner.url,
      id[0]!.id,
    );
    await updateDataroomTypeByMediaURLe(
      validatedFields.data.dataroom!.map((d) => d.url),
      id[0]!.id,
    );

    return { success: true };
  } catch (error) {
    logger.error({message: `Error creating business: ${error}`});
    return { success: false, error: "Failed to create business" };
  }
}

export async function declineBusinessAction(businessID: string) {
  const currentUser = auth();
  if (!currentUser.userId) throw new Error("Unauthorized");
  checkRole("admin")
  try {
    const statusResult = await declineUserStatus(businessID);

    if (statusResult.success) {
      return {
        status: 200,
        message: "User status updated to 'declined' successfully",
      };
    } else {
      return {
        status: 500,
        message: statusResult.error || "Failed to update user status",
      };
    }
  } catch (error) {
    logger.error({message: `Server action error: ${error}`});
    return { success: false, error: "Failed to get business" };
  }
}
