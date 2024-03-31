import {
  timestamp,
  pgTable,
  text,
  varchar,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { orgMemberships } from "./org-user";
import { pages } from "./page";
import { createInsertSchema } from "drizzle-zod";

export const orgs = pgTable(
  "orgs",
  {
    id: varchar("id", { length: 50 }).notNull().primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    desc: varchar("desc", { length: 3000 }).notNull(),
    orgImageUrl: text("orgImageUrl").default("").notNull(),
    orgFileKey: text("orgFileKey").default("").notNull(),
    orgVerified: boolean("orgVerified").default(false).notNull(),
    adminId: text("adminId")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    joinedAt: timestamp("joinedAt").defaultNow(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => {
    return {
      orgNameIdx: index("orgNameIdx").on(table.name),
      orgAdminIdx: index("orgAdminIdx").on(table.adminId),
      orgJoinedAtIdx: index("orgJoinedAtIdx").on(table.joinedAt),
    };
  }
);

export const orgRelations = relations(orgs, ({ one, many }) => ({
  adminUser: one(users, {
    fields: [orgs.adminId],
    references: [users.id],
  }),
  pages: many(pages),
  orgMemberships: many(orgMemberships),
}));

export const deleteOrgValidator = createInsertSchema(orgs).pick({ id: true });

export const insertOrgValidator = createInsertSchema(orgs, {
  id: (schema) =>
    schema.id
      .min(1, {
        message: "Organisation id must contain atleast one letter",
      })
      .max(50, {
        message: "Organisation id must have a maximum of 50 characters",
      })
      .regex(/^[A-Za-z]/, "Organisation id must have atleast one letter")
      .regex(/^[a-zA-Z0-9_.]+$/, {
        message:
          "Organisation id can have only letters, underscores and periods",
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
}).pick({
  id: true,
  name: true,
  desc: true,
  orgFileKey: true,
  orgImageUrl: true,
});

export type ClientOrg = Pick<
  InferSelectModel<typeof orgs>,
  | "id"
  | "name"
  | "desc"
  | "orgImageUrl"
  | "orgFileKey"
  | "orgVerified"
  | "joinedAt"
  | "updatedAt"
>;
export type NewOrgPayload = Pick<
  InferInsertModel<typeof orgs>,
  "id" | "name" | "desc" | "orgImageUrl" | "orgFileKey"
>;
