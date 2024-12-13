import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { encrypt } from "../db/encrypted-types";

("server-only");

export async function getUser() {
  return db.query.user.findMany();
}

export async function getUserByID(id: string) {
  return db.query.user.findFirst({
    where: (model, { eq }) => eq(model.userID, id),
  });
}

export async function createUserForCurrentUser() {
  // const currentUser = auth();
  const cuser = await currentUser();

  if (!cuser) throw new Error("Unauthorized");

  const userQuery = await db.query.user.findMany({
    where: (model, { eq }) => eq(model.userID, cuser.id),
  });

  if (userQuery.length === 0) {
    await db.insert(user).values({
      userID: cuser.id,
      name: cuser.firstName,
      privacy: false
    });
  }
}
