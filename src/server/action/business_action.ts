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

export async function approveBusinessAction(businessID: number) {
  try {
    const statusResult = await acceptUserStatus(businessID);

    if (statusResult.success) {
      return { status: 200, message: "User status updated successfully" };
    } else {
      return {
        status: 500,
        message: statusResult.error ?? "Failed to update user status",
      };
    }
  } catch (error) {
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}

export async function createFundraising(formData: FormData) {
  console.log("Creating fundraising with form data:", formData);
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
    console.error("Error parsing JSON data:", error);
  }

  // Validate the form data with parsed JSON values
  const validatedFields = formSchema.safeParse({
    company: formData.get("company"),
    slogan: formData.get("slogan"),
    website: formData.get("website"),
    target_stock: formData.get("target_stock"), // Fixed typo: removed colon
    min_investment: formData.get("min_investment"),
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
    console.error("Validation errors:", validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log("Validated fields:", validatedFields.data);
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
    console.error("Error creating business:", error);
    return {
      errors: {
        form: ["Failed to create business. Please try again."],
      },
    };
  }
}

export async function declineBusinessAction(businessID: number) {
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
    console.error("Server action error:", error);
    return { status: 500, message: "Internal server error" };
  }
}
