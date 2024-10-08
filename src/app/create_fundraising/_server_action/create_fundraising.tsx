"use server";

import { auth } from "@clerk/nextjs/server";
import { formSchema } from "~/app/create_fundraising/schema";
import { z } from "zod";

export async function createFundraising(formData: FormData) {
  "use server";

  const validatedFields = formSchema.safeParse({
    company: formData.get("company"),
    title: formData.get("title"),
    website: formData.get("website"),
    target_fund: formData.get("target_fund:"),
    min_investment: formData.get("min_investment"),
    allocation: formData.get("allocation"),
    valuation: formData.get("valuation"),
    deadline: formData.get("deadline"),
    email: formData.get("email"),
    industry: formData.get("industry"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  console.log(formData);
  console.log(formData.get("deadline"));
  console.log(auth().userId);
}
