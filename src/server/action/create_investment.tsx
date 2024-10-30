"use server";

import { schemaForDB } from "~/app/create_investment/schema";
import { saveInvestment } from "~/server/createQuery";

export async function createInvestment(businessID: number, formData: FormData) {
  "use server";

  const validatedFields = schemaForDB.safeParse({
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  await saveInvestment(businessID, validatedFields.data.amount);
}
