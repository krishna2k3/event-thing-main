import { pgTable, text, primaryKey, varchar } from "drizzle-orm/pg-core";
import { users } from "./user";
import { orgs } from "./org";
import { relations } from "drizzle-orm";

export const orgMemberships = pgTable(
  "orgMemberships",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    orgId: varchar("orgId", { length: 50 })
      .notNull()
      .references(() => orgs.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.orgId),
  })
);

export const orgMembershipsRelations = relations(orgMemberships, ({ one }) => ({
  org: one(orgs, {
    fields: [orgMemberships.orgId],
    references: [orgs.id],
  }),
  orgMember: one(users, {
    fields: [orgMemberships.userId],
    references: [users.id],
  }),
}));

export const orgMembershipRequests = pgTable(
  "orgMembershipRequests",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    orgId: varchar("orgId", { length: 50 })
      .notNull()
      .references(() => orgs.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.orgId),
  })
);

export const orgMembershipRequestsRelations = relations(orgMembershipRequests, ({ one }) => ({
  org: one(orgs, {
    fields: [orgMembershipRequests.orgId],
    references: [orgs.id],
  }),
  orgMembershipRequestedBy: one(users, {
    fields: [orgMembershipRequests.userId],
    references: [users.id],
  }),
}));
