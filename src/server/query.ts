import {db} from "~/server/db";
import "server-only";

// user client -> ship js to the client but code still on the server
// user server -> expose endpoint to the client
// running on the server

export async function getUser() {

    return db.query.user.findMany();
}

