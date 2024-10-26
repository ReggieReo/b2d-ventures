"use server";

import { formSchema } from "~/app/create_fundraising/schema";

export async function createInvestment(formData: FormData) {
  "use server";

  const validatedFields = formSchema.safeParse({});

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  console.log(validatedFields);
}
