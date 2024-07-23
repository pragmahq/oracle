import { boolean, integer, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  visibility: boolean("visibility").notNull(),
  discord_id: varchar("discord_id").primaryKey(),
  username: varchar("username").notNull(),
  display_name: varchar("display_name").notNull(),
  runes: integer("runes").notNull(), // Rise, Tarnished.
  social_links: varchar("social_links"),
  account_secret: varchar("account_secret").notNull(),
  onboarding: boolean("onboarding").$default(() => false),
});
