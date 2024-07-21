import { config } from "dotenv";

config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

export const ENV = {
  POSTGRES_URL: requireEnv("POSTGRES_URL"),
};
