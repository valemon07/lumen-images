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

const pool = new Pool({
  host: env.DATABASE_HOST,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
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