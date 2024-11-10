"use server";

import { formSchema } from "~/app/create_fundraising/schema";
import { createBusiness } from "~/server/createQuery";
import {
  updateMediaImageTypeByMediaURLe,
  updateMediaLogoTypeByMediaURLe,
} from "~/server/updateQuery";

export async function createFundraising(formData: FormData) {
  "use server";

  console.log("Creating fundraising with form data:", formData);
  // Parse JSON strings for media and logo
  let mediaData: unknown[] = [];
  let logoData: unknown = null;

  try {
    const mediaString = formData.get("media");
    if (mediaString && typeof mediaString === "string") {
      mediaData = JSON.parse(mediaString) as unknown[];
    }

    const logoString = formData.get("logo");
    if (logoString && typeof logoString === "string") {
      logoData = JSON.parse(logoString);
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
    pitch: formData.get("pitch"),
  });

  if (!validatedFields.success) {
    console.error("Validation errors:", validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

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
