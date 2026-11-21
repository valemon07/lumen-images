import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { nextCookies } from "better-auth/next-js";
import {
  sendVerificationEmail,
  sendResetPassword,
  sendChangeEmailConfirmation,
  sendDeleteAccountVerification,
} from "./email";
import { env } from "@/lib/env";

// Shares DATABASE_URL with app/lib/db.ts. With Supabase, use the Session
// pooler URL: direct db.*.supabase.co hosts are IPv6-only, which Vercel
// and many local networks cannot reach.
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // Encrypted but not certificate-verified, matching `ssl: "require"` in db.ts.
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const auth = betterAuth({
  database: pool,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    sendResetPassword,
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendVerificationEmail,
    sendOnSignUp: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation,
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification,
    },
    additionalFields: {
      name: {
        type: "string",
        required: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [nextCookies()],
});