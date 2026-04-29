import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { Environment } from "vitest/runtime";
import { prisma } from "@/lib/prisma";

const getNewDatabaseURL = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be specified.");
  }

  const dbUrl = new URL(process.env.DATABASE_URL);
  dbUrl.searchParams.set("schema", schema);

  return dbUrl.toString();
};

export default (<Environment>{
  name: "prisma",
  viteEnvironment: "ssr",
  async setup() {
    // start testing
    const schema = randomUUID();
    process.env.DATABASE_URL = getNewDatabaseURL(schema);

    console.log(`[Test Environment] Using schema: ${process.env.DATABASE_URL}`);

    execSync("npx prisma migrate deploy", {
      cwd: process.cwd(),
      stdio: "inherit",
    });

    return {
      async teardown() {
        // cleanup
        try {
          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
          );
        } finally {
          await prisma.$disconnect();
          // Reset DATABASE_URL for next test
          delete process.env.DATABASE_URL;
        }
      },
    };
  },
});
