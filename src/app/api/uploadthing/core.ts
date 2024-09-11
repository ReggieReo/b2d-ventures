import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { z } from "zod";
import { UploadedFileData } from "uploadthing/types";
import { business, media, user } from "~/server/db/schema";
import { serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 40 } })
    .input(z.string())
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, input }) => {
      // This code runs on your server before upload
      const user = auth();

      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user) throw new UploadThingError("Unauthorized");
      console.log(input, "test test");
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId, input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log(metadata.input, "test test");
      console.log("file url", file.url);
      console.log("writing to db");

      await db.insert(media).values({
        userID: metadata.userId ?? "",
        url: file.url,
        name: file.name,
        businessID: 1,
      });

      // businessID: serial("businessID").references(() => business.businessID),
      //     userID: varchar("userID", {length: 256}).references(() => user.userID),
      //     url: varchar("url", {length: 1024}).notNull(),
      //     name: varchar("name", {length: 256}).notNull(),
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
  // // Define as many FileRoutes as you like, each with a unique routeSlug
  // videoUploader: f({ "video/mp4": { maxFileSize: "16MB" } })
  //     // Set permissions and file types for this FileRoute
  //     .middleware(async ({ req }) => {
  //         // This code runs on your server before upload
  //         const user = auth();
  //         // If you throw, the user will not be able to upload
  //         if (!user) throw new UploadThingError("Unauthorized");
  //
  //         // Whatever is returned here is accessible in onUploadComplete as `metadata`
  //         return { userId: user.userId };
  //     })
  //     .onUploadComplete(async ({ metadata, file }) => {
  //         // This code RUNS ON YOUR SERVER after upload
  //         console.log("Upload complete for userId:", metadata.userId);
  //
  //         console.log("file url", file.url);
  //         await db.insert(image).values({
  //             name: file.name,
  //             url: file.url,
  //             userId: metadata.userId ?? "",
  //         });
  //         // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
  //         return { uploadedBy: metadata.userId };
  //     }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
