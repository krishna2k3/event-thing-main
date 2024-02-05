import { pgTable, text, primaryKey, varchar } from "drizzle-orm/pg-core";
import { users } from "./user";
import { posts } from "./post";
import { relations } from "drizzle-orm";

export const postUserRegistration = pgTable(
    "postUserRegistration",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id),
      postId: varchar("postId", { length: 15 })
        .notNull()
        .references(() => posts.id),
    },
    (t) => ({
      pk: primaryKey(t.userId, t.postId),
    })
  );
  
  export const postUserRegistrationRelations = relations(
    postUserRegistration,
    ({ one }) => ({
      post: one(posts, {
        fields: [postUserRegistration.postId],
        references: [posts.id],
      }),
      postRegistratar: one(users, {
        fields: [postUserRegistration.userId],
        references: [users.id],
      }),
    })
  );