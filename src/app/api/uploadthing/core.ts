import { getToken } from "next-auth/jwt";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

export const utapi = new UTApi();

export const ourFileRouter = {
  orgImageUploader: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      console.log("Going to check token");
      console.log("This is the request");
      console.log(req);
      const user = await getToken({ req });
      console.log("User =", user);
      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadError(async (error) => {
      console.log("This is the error: ", error.error.message);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),

  pageImageUploader: f({ image: { maxFileSize: "1MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = await getToken({ req });

      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadError(async (error) => {
      console.log("This is the error: ", error.error.message);
      // console.log("This is the cause of error: ", error.error.cause?.cause);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),

  postImageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await getToken({ req });

      if (!user) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadError(async (error) => {
      console.log("This is the error: ", error.error.message);
      // console.log("This is the cause of error: ", error.error.cause?.cause);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
