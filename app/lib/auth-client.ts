import { createAuthClient } from "better-auth/react";

// Runs in the browser: never import "@/lib/env" here (server-only secrets).
// Without a baseURL, better-auth uses the current origin, which also works
// on Vercel preview deployments.
export const authClient = createAuthClient();
