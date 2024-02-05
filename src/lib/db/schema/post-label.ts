import { pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { posts } from "./post";
import { labels } from "./label";
import { relations } from "drizzle-orm";

export const postLabels = pgTable(
  "postLabels",
  {
    postId: varchar("postId", { length: 15 })
      .notNull()
      .references(() => posts.id),
    labelId: varchar("labelId", { length: 10 })
      .notNull()
      .references(() => labels.id),
  },
  (table) => ({
    pk: primaryKey(table.labelId, table.postId),
  })
);

export const postLabelRelations = relations(postLabels, ({ one }) => ({
  post: one(posts, {
    fields: [postLabels.postId],
    references: [posts.id],
  }),
  postLabel: one(labels, {
    fields: [postLabels.labelId],
    references: [labels.id],
  }),
}));
