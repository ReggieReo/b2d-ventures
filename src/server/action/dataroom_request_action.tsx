"use server";

import {
  createDataroomRequest,
  getRequestByBusinessID,
  getRequestByIDWithUser,
  updateDataroomRequest,
} from "~/server/repository/dataroom_request_repository";

export async function createDataroomRequestAction(pageID: number) {
  return await createDataroomRequest(pageID);
}

export async function getRequestAction(pageID: number) {
  return await getRequestByBusinessID(pageID);
}

export async function updateDataroomRequestAction(
  pageID: number,
  userID: string,
  newStatus: number,
) {
  return await updateDataroomRequest(pageID, userID, newStatus);
}
