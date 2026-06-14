import "dotenv/config";
import { defineConfig } from "prisma/config";

function getMigrationUrl(): string {
  const directUrl = process.env.DIRECT_URL;
  if (directUrl && !directUrl.includes("[") && !directUrl.includes("]")) {
    return directUrl;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }

  return databaseUrl;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: getMigrationUrl(),
  },
});
