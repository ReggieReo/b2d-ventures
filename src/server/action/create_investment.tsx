"use server";

import { formSchema } from "~/app/create_fundraising/schema";
import { auth } from "@clerk/nextjs/server";

export async function createInvestment(businessID: number, formData: FormData) {
  "use server";

  const user = auth();
  console.log(user.userId);
  console.log(businessID);

  console.log(formData);
  const validatedFields = formSchema.safeParse({});

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  console.log(validatedFields);
}
