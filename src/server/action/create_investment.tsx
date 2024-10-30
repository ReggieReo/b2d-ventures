"use server";

import { schema } from "~/app/create_investment/schema";
import { saveInvestment } from "~/server/createQuery";

export async function createInvestment(businessID: number, formData: FormData) {
  "use server";

  const validatedFields = schema.safeParse({
    businessID: formData.get("businessID"),
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await saveInvestment(businessID, validatedFields.data.amount);
}
