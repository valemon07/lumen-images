import "server-only";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AWS_REGION: z.string(),
  AWS_BUCKET_NAME: z.string(),
  EMAIL_FROM: z.string().min(1),
  RESEND_API_KEY: z.string().startsWith("re_"),
  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  GOOGLE_API_KEY: z.string(),
  NEXT_PUBLIC_BASE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);