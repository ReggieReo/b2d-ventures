import { redirect } from "next/navigation";
import { createUserForCurrentUser } from "~/server/query";

export async function GET() {
  await createUserForCurrentUser();
  redirect("/");
}
