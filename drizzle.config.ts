import { defineConfig } from "drizzle-kit";
import { ENV } from "./env";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: ENV.POSTGRES_URL,
    port: 5432,
  },
});
