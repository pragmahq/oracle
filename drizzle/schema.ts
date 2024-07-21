import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  discord_id: integer("discord_id").primaryKey(),
  username: varchar("username").notNull(),
  display_name: varchar("display_name"),
});
