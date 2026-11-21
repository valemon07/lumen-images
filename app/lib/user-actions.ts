"use server";

import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { auth } from "@/app/lib/auth";

export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function signUpEmail(
  prevState: string | undefined,
  formData: FormData,
) {
  let isSuccessful = false;
  try {
    await auth.api.signUpEmail({
      body: {
        name: formData.get("name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        password: formData.get("password")?.toString() || "",
        callbackURL: "/home",
      },
    });
    isSuccessful = true;
  } catch (error) {
    console.error("Sign-up failed:", error);
    if (error instanceof APIError && typeof error.message === "string" && error.message) {
      return error.message;
    }
    return "Sign-up failed. Please try again.";
  }
  if (isSuccessful) redirect("/verify-email");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  let isSuccessful = false;
  try {
    await auth.api.signInEmail({
      body: {
        email: formData.get("email")?.toString() || "",
        password: formData.get("password")?.toString() || "",
        callbackURL: formData.get("redirectTo")?.toString() || "/home",
      },
    });
    isSuccessful = true;
  } catch (error) {
    console.error("Sign-in failed:", error);
    if (error instanceof APIError && Number(error.statusCode) === 403) {
      return "Please verify your email address before signing in.";
    }
    return "Invalid email or password.";
  }
  if (isSuccessful) redirect("/home");
}
