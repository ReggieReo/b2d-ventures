"use server";

import {
  createDataroomRequest,
  getRequestByBusinessID,
  getRequestByIDWithUser,
  updateDataroomRequest,
} from "~/server/repository/dataroom_request_repository";

export async function createDataroomRequestAction(pageID: string) {
  return await createDataroomRequest(pageID);
}

export async function getRequestAction(pageID: string) {
  return await getRequestByBusinessID(pageID);
}

export async function updateDataroomRequestAction(
  pageID: string,
  userID: string,
  newStatus: number,
) {
  return await updateDataroomRequest(pageID, userID, newStatus);
}
