import { redirect } from "next/navigation";

import { createUserForCurrentUser } from "~/server/repository/user_repository";

export async function GET() {
  await createUserForCurrentUser();
  redirect("/");
}
