import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]),
  JWT_SECRET: z.coerce.string(),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.coerce.string(),
  WEB_DOMAIN: z.url().default("http://localhost:5173"),
});

const _env = EnvSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "❌Environment variables incorrectly set!",
    z.treeifyError(_env.error),
  );
  throw new Error("Environment variables incorrectly set!");
}

export const env = _env.data;
