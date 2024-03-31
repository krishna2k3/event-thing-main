import {
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { relations } from "drizzle-orm";
import { pages } from "./page";
import { postLabels } from "./post-label";
import { postUserRegistration } from "./post-user";

export const allowedUserEnum = pgEnum("allowedUser", [
  "All",
  "Organization Members Only",
  "Page Members Only",
]);

export const posts = pgTable(
  "posts",
  {
    id: varchar("id", { length: 15 })
      .$defaultFn(() => nanoid(15))
      .notNull()
      .primaryKey(),
    title: varchar("title", { length: 120 }).notNull(),
    price: integer("price").notNull().default(0),
    content: json("json"),
    allowedUsers: allowedUserEnum("allowedUsers").notNull().default("Page Members Only"),
    max_registrations: integer("max_registrations").notNull().default(0),
    pageId: varchar("pageId", { length: 12 })
      .notNull()
      .references(() => pages.id),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => {
    return {
      titleIdx: index("titleIdx").on(table.title),
    };
  }
);

export const postRelations = relations(posts, ({ one, many }) => ({
  postOf: one(pages, {
    fields: [posts.pageId],
    references: [pages.id],
  }),
  labelOfPost: many(postLabels),
  postUserRegistration: many(postUserRegistration),
}));

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
