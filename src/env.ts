import { config } from "dotenv";

config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

const ENV = {
  POSTGRES_URL: requireEnv("POSTGRES_URL"),
  BOT_TOKEN: requireEnv("BOT_TOKEN"),
  BOT_APPLICATION_ID: requireEnv("BOT_APPLICATION_ID"),
};

export default ENV;
