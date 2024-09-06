import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import { user } from "~/server/db/schema";
import "server-only";

// user client -> ship js to the client but code still on the server
// user server -> expose endpoint to the client
// running on the server

export async function getUser() {
  return db.query.user.findMany();
}
export async function getAllImages() {
  return db.query.media.findMany();
}

export async function createUserForCurrentUser() {
  const currentUser = auth();

  if (!currentUser.userId) throw new Error("Unauthorized");

  const userQuery = await db.query.user.findMany({
    where: (model, { eq }) => eq(model.userID, currentUser.userId),
  });

  if (userQuery.length === 0) {
    console.log("no user");
    await db.insert(user).values({
      userID: currentUser.userId,
    });
  }
}
