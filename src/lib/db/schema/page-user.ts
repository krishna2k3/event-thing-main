import {
  pgTable,
  text,
  primaryKey,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./user";
import { pages } from "./page";
import { relations } from "drizzle-orm";

export const pageMemberships = pgTable(
  "pageMemberships",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    pageId: varchar("pageId", { length: 12 })
      .notNull()
      .references(() => pages.id),
    approved: boolean("approved").default(false),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.pageId),
  })
);

export const pageMembershipRelations = relations(
  pageMemberships,
  ({ one }) => ({
    page: one(pages, {
      fields: [pageMemberships.pageId],
      references: [pages.id],
    }),
    pageMember: one(users, {
      fields: [pageMemberships.userId],
      references: [users.id],
    }),
  })
);

export const pageSubscriptions = pgTable(
  "pageSubscriptions",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    pageId: varchar("pageId", { length: 12 })
      .notNull()
      .references(() => pages.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.pageId),
  })
);

export const pageSubscriptionsRelations = relations(
  pageSubscriptions,
  ({ one }) => ({
    page: one(pages, {
      fields: [pageSubscriptions.pageId],
      references: [pages.id],
    }),
    pageSubscriber: one(users, {
      fields: [pageSubscriptions.userId],
      references: [users.id],
    }),
  })
);

// export const pageMembershipRequests = pgTable(
//   "pageMembershipRequests",
//   {
//     userId: text("userId")
//       .notNull()
//       .references(() => users.id),
//     pageId: varchar("pageId", { length: 12 })
//       .notNull()
//       .references(() => pages.id),
//   },
//   (t) => ({
//     pk: primaryKey(t.userId, t.pageId),
//   })
// );

// export const pageMembershipRequestsRelations = relations(
//   pageMembershipRequests,
//   ({ one }) => ({
//     page: one(pages, {
//       fields: [pageMembershipRequests.pageId],
//       references: [pages.id],
//     }),
//     pageMembershipRequestedBy: one(users, {
//       fields: [pageMembershipRequests.userId],
//       references: [users.id],
//     }),
//   })
// );
