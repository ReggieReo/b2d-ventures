import "server-only";
import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import { business } from "~/server/db/schema";
import { eq } from "drizzle-orm";
// user client -> ship js to the client but code still on the server
// user server -> expose endpoint to the client
// running on the server

export async function getUser() {
  return db.query.user.findMany();
}

export async function getUserByID(id: string) {
  return db.query.user.findFirst({
    where: (model, { eq }) => eq(model.userID, id),
  })
}

export async function getAllImages() {
  return db.query.media.findMany();
}

export async function getAllBusiness() {
  return db.query.business.findMany();
}

export async function getInvestmentByBusinessID(businessID: number) {
  return db.query.investment.findMany({
    where: (model, { eq }) => eq(model.businessID, businessID),
  });
}

export async function getBusinessByID(businessID: number) {
  return db.query.business.findFirst({
    where: (model, { eq }) => eq(model.businessID, businessID),
  });
}

export async function getRequest(businessID: number) {
  const curUserID = auth().userId;
  if (!curUserID) throw new Error("Unauthorized");

  return db.query.dataroomRequest.findFirst({
    where: (model, { eq, and }) =>
      and(eq(model.userID, curUserID), eq(model.businessID, businessID)),
  });
}

export async function getRequestByID(businessID: number) {
  return db.query.dataroomRequest.findMany({
    where: (model, { eq }) => eq(model.businessID, businessID),
    with: {
      user: true
    }
  });
}

export async function getBusinessByUserID() {
  // Return the business from the business owner ID
  const userID = auth().userId;

  if (!userID) throw new Error("Unauthorized");

  return db.query.business.findFirst({
    where: (model, { eq }) => eq(model.userID, userID),
  });
}

export async function approveBusiness(businessID: number) {
  try {
    await db
      .update(business)
      .set({ approve: true })
      .where(eq(business.businessID, businessID));
    return { success: true };
  } catch (error) {
    console.error("Error approving business:", error);
    return { success: false, error: "Failed to approve business" };
  }
}

export async function getConfirmBusinesses() {
  return db.query.business.findMany({
    where: (model, { eq }) => eq(model.approve, true),
  });
}
