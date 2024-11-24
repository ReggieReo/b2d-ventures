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
  imageUploader: f({
    "image/webp": { maxFileSize: "4MB", maxFileCount: 40 },
    "image/jpeg": { maxFileSize: "4MB", maxFileCount: 40 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = auth();
      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user) throw new UploadThingError("Unauthorized");
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      await db.insert(media).values({
        userID: metadata.userId ?? "",
        url: file.url,
        name: file.name,
        businessID: 1,
        status: 4,
      });
      return { uploadedBy: metadata.userId };
    }),

  logoUploader: f({
    "image/webp": { maxFileSize: "512KB" },
    "image/jpeg": { maxFileSize: "512KB" },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = auth();
      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user) throw new UploadThingError("Unauthorized");
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      await db.insert(media).values({
        userID: metadata.userId ?? "",
        url: file.url,
        name: file.name,
        status: 4,
        businessID: 1,
      });
      return { uploadedBy: metadata.userId };
    }),

  bannerUploader: f({
    "image/webp": { maxFileSize: "2MB" },
    "image/jpeg": { maxFileSize: "2MB" },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = auth();
      // If you throw, the user will not be able to upload
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user) throw new UploadThingError("Unauthorized");
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      await db.insert(media).values({
        userID: metadata.userId ?? "",
        url: file.url,
        name: file.name,
        status: 4,
        businessID: 1,
      });
      return { uploadedBy: metadata.userId };
    }),

  dataroomUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 40 } })
    .middleware(async ({ req }) => {
      const user = auth();
      console.log(user);
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user) throw new UploadThingError("Unauthorized");
      console.log(user, "done middleware");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(metadata, file, "before insert");
      await db.insert(media).values({
        userID: metadata.userId ?? "",
        url: file.url,
        name: file.name,
        status: 4,
        businessID: 1,
      });
      console.log(metadata, "done onUploadComplete");
      return { uploadedBy: metadata.userId };
    }),

  financialStatementUploader: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const user = auth();
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        // Add validation
        if (!metadata.userId) {
          throw new Error("No userId in metadata");
        }

        // Try inserting with explicit businessID handling
        const result = await db.insert(media).values({
          userID: metadata.userId,
          url: file.url,
          name: file.name,
          type: "financial_statement",
          status: 0,
          businessID: 1, // Consider making this dynamic if needed
        });

        // Return detailed response
        return {
          success: true,
          uploadedBy: metadata.userId,
          fileDetails: {
            url: file.url,
            name: file.name,
          },
        };
      } catch (error) {
        throw error; // Re-throw to ensure uploadthing knows about the failure
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
