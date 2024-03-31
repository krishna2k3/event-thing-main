import { relations } from "drizzle-orm";
import { index, pgTable, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { postLabels } from "./post-label";

export const labels = pgTable(
  "labels",
  {
    id: varchar("id", { length: 10 })
      .$defaultFn(() => nanoid(10))
      .notNull()
      .primaryKey(),
    name: varchar("name", { length: 50 }).notNull().unique(),
  },
  (table) => {
    return {
      nameIdx: index("nameIdx").on(table.name),
    };
  }
);

export const labelRelations = relations(labels, ({ many }) => ({
  postsWithLabel: many(postLabels),
}));

export type Label = typeof labels.$inferSelect;
export type NewLabel = typeof labels.$inferInsert;
