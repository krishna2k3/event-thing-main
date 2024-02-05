import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 128 characters long",
    }),
  pageId: z.string(),
  content: z.any(),
  price: z.string(),
  allowedUsers: z.enum([
    "All",
    "Organization Members Only",
    "Page Members Only",
  ]),
  max_registrations: z.string(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
