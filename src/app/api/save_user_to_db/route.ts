import { redirect } from "next/navigation";

import { createUserForCurrentUser } from "~/server/createQuery";

export async function GET() {
  await createUserForCurrentUser();
  redirect("/");
}
