import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import dotenv from "dotenv";
import * as schema from "../drizzle/schema";
import ENV from "./env";

dotenv.config();

const client = new Client({
  connectionString: ENV.POSTGRES_URL,
});

await client.connect();

const db = drizzle(client, { schema });
export default db;

export const end = async () => await client.end();
