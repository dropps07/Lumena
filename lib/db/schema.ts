import { pgTable, uuid, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

export const gradients = pgTable("gradients", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  config: jsonb("config").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  viewCount: integer("view_count").default(0),
});