'use server'

import {createDataroomRequest} from "~/server/createQuery";
import {getRequest, getRequestByID} from "~/server/fetchQuery";

export async function createDataroomRequestAction(pageID: number) {
    return await createDataroomRequest(pageID);
}

export async function getRequestAction(pageID: number) {
    return await getRequest(pageID);
}

export async function getRequestByIDAction(pageID: number) {
    return await getRequestByID(pageID);
}

export async function updateDataroomRequestAction(pageID: number, userID: number, newStatus: number) {
    return await updateDataroomRequestAction(pageID, userID, newStatus)
}