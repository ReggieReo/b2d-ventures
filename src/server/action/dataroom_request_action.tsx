'use server'

import {createDataroomRequest} from "~/server/createQuery";
import {getRequest} from "~/server/fetchQuery";

export async function createDataroomRequestAction(pageID: number) {
    return await createDataroomRequest(pageID);
}

export async function getRequestAction(pageID: number) {
    return await getRequest(pageID);
}