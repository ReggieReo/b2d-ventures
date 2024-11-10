import "server-only";
import { db } from "~/server/db";
import { inArray, eq } from "drizzle-orm";
import { media } from "~/server/db/schema";

// user client -> ship js to the client but code still on the server
// user server -> expose endpoint to the client
// running on the server

export async function updateMediaImageTypeByMediaURLe(
  mediaURL: string[],
  businessID: number,
) {
  await db
    .update(media)
    .set({
      businessID,
      type: "image",
    })
    .where(inArray(media.url, mediaURL));
}

export async function updateMediaLogoTypeByMediaURLe(
  mediaURL: string,
  businessID: number,
) {
  await db
    .update(media)
    .set({
      businessID,
      type: "logo",
    })
    .where(eq(media.url, mediaURL));
}