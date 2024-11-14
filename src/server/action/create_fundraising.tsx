"use server";

import { formSchema } from "~/app/create_fundraising/schema";
import { createBusiness } from "~/server/createQuery";
import {
  updateDataroomTypeByMediaURLe,
  updateMediaImageTypeByMediaURLe,
  updateMediaLogoTypeByMediaURLe,
} from "~/server/updateQuery";

export async function createFundraising(formData: FormData) {
  "use server";

  console.log("Creating fundraising with form data:", formData);
  // Parse JSON strings for media and logo
  let mediaData: unknown[] = [];
  let logoData: unknown = null;
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
    target_fund: formData.get("target_fund"), // Fixed typo: removed colon
    min_investment: formData.get("min_investment"),
    allocation: formData.get("allocation"),
    valuation: formData.get("valuation"),
    deadline: formData.get("deadline"),
    email: formData.get("email"),
    industry: formData.get("industry"),
    media: mediaData, // Use parsed media array
    logo: logoData, // Use parsed logo object
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
      validatedFields.data.logo!.url,
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
