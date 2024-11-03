'use server'

import {createDataroomRequest, updateDataroomRequest} from "~/server/createQuery";
import {getRequest, getRequestByID} from "~/server/fetchQuery";

export async function createDataroomRequestAction(pageID: number) {
    return await createDataroomRequest(pageID);
}

export async function getRequestAction(pageID: number) {
    return await getRequest(pageID);
}

export async function updateDataroomRequestAction(pageID: number, userID: string, newStatus: number) {
    return await updateDataroomRequest(pageID, userID, newStatus)
}