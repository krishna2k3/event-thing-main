import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { users } from "./user";
import { orgs } from "./org";
import {
  pageMembershipRequests,
  pageMemberships,
  pageSubscriptions,
} from "./page-user";
import { posts } from "./post";
import { createInsertSchema } from "drizzle-zod";

export const pages = pgTable(
  "pages",
  {
    id: varchar("id", { length: 50 }).notNull().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    desc: varchar("desc", { length: 3000 }).notNull(),
    orgId: varchar("orgId", { length: 50 })
      .notNull()
      .references(() => orgs.id),
    pageImageUrl: text("pageImageUrl").default("").notNull(),
    pageFileKey: text("pageFileKey").default("").notNull(),
    pageVerified: boolean("pageVerified").notNull(),
    moderatorEmail: text("moderatorEmail")
      .notNull()
      .references(() => users.email),
    joinedAt: timestamp("joinedAt").defaultNow(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => {
    return {
      nameIdx: index("pageNameIdx").on(table.name),
      pageOrgIdx: index("pageOrgIdx").on(table.orgId),
      moderatorEmailIdx: index("moderatorEmailIdx").on(table.moderatorEmail),
      pageJoinedIdx: index("pageJoinedAtIdx").on(table.joinedAt),
    };
  }
);

export const pageRelations = relations(pages, ({ one, many }) => ({
  pageOf: one(orgs, {
    fields: [pages.orgId],
    references: [orgs.id],
  }),
  moderatorUser: one(users, {
    fields: [pages.moderatorEmail],
    references: [users.email],
  }),
  posts: many(posts),
  pageMemberships: many(pageMemberships),
  pageMembershipRequests: many(pageMembershipRequests),
  pageSubscriptions: many(pageSubscriptions),
}));

export const deletePageValidator = createInsertSchema(pages).pick({ id: true });

export const insertPageValidator = createInsertSchema(pages, {
  id: (schema) =>
    schema.id
      .min(1, {
        message: "Page account handle must contain atleast one letter",
      })
      .max(50, {
        message: "Page account handle must have a maximum of 50 characters",
      })
      .regex(/^[A-Za-z]/, "Page account handle must have atleast one letter")
      .regex(/^[a-zA-Z0-9_.]+$/, {
        message:
          "Page account handle can have only letters, underscores and periods",
      }),
  name: (schema) =>
    schema.name
      .min(1, {
        message: "Name of the organisation must have atleast one character",
      })
      .max(64, {
        message: "Name of the organisation cannot exceed 64 characters",
      })
      .regex(/[a-zA-Z][a-zA-Z ]+/, {
        message: "Name of the organization must contain at least one letter",
      }),
  desc: (schema) =>
    schema.desc
      .min(1, {
        message:
          "Description of the organisation must have atleast one character",
      })
      .max(255, {
        message: "Description of the organisation cannot exceed 255 characters",
      }),
  moderatorEmail: (schema) =>
    schema.moderatorEmail.email({
      message:
        "Description of the organisation must have atleast one character",
    }),
}).pick({
  id: true,
  name: true,
  desc: true,
  pageFileKey: true,
  pageImageUrl: true,
  moderatorEmail: true,
});

export type Page = InferSelectModel<typeof pages>;
export type NewPagePayload = Pick<
  InferSelectModel<typeof pages>,
  "id" | "name" | "desc" | "pageImageUrl" | "pageFileKey" | "moderatorEmail"
>;
