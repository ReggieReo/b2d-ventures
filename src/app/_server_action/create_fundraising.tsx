"use server";

import { auth } from "@clerk/nextjs/server";

export async function createFundraising(formData: FormData) {
  "use server";
  console.log(formData);
  console.log(formData.get("deadline"));
  console.log(auth().userId);
}
