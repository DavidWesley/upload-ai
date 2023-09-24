import "dotenv/config"

import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  STORAGE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().startsWith("sk-"),
  PORT: z.coerce.number().positive().min(80).max(65_000),
  SUPABASE_PROJECT_URL: z.string().url(),
  SUPABASE_API_KEY: z.string().startsWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
})

export const ENV = envSchema.parse(process.env)
