import {
  boolean,
  integer,
  pgTable,
  varchar,
  text,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  visibility: boolean("visibility").notNull(),
  bio: text("bio").$default(() => "Bio"),
  interests: varchar("interests"),
  runes: integer("runes").notNull(), // Rise, Tarnished!
  account_secret: varchar("account_secret").notNull(),
  onboarding: boolean("onboarding").$default(() => false),
  achievements: json("achievements").$default(() => {
    achievements: [];
  }),
});
