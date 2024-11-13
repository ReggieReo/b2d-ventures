import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { z } from "zod";
import { media } from "~/server/db/schema";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({"image/webp": { maxFileSize: "4MB", maxFileCount: 40}, "image/jpeg": { maxFileSize: "4MB", maxFileCount: 40}})
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, input }) => {
      // This code runs on your server before upload
      const user = auth();
      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user) throw new UploadThingError("Unauthorized");
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
      console.log("insert complete");
      return { uploadedBy: metadata.userId };
    }),

  logoUploader: f({"image/webp": { maxFileSize: "512KB" }, "image/jpeg": { maxFileSize: "512KB" }})
    .middleware(async ({ req, input }) => {
      // This code runs on your server before upload
      const user = auth();
      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user) throw new UploadThingError("Unauthorized");
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
      console.log("insert complete");
      return { uploadedBy: metadata.userId };
    }),
    
  dataroomUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 40 } })
    .middleware(async ({ req, input }) => {
      const user = auth();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.userId, input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(media).values({
        userID: metadata.userId ?? "",
        url: file.url,
        name: file.name,
        businessID: 1,
      });
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
