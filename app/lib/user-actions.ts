"use server";

import sql from "./db";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { User } from "./types";

export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

export async function getUserByEmail(email: string) {
  try {
    const returnedUser = await sql<
      User[]
    >`SELECT * FROM users WHERE email=${email}`;
    console.log(returnedUser[0]);
    return returnedUser[0];
  } catch (e) {
    console.error("Failed to fetch user: ", e);
    throw new Error("Failed to fetch user.");
  }
}

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
    return `Something went wrong: ${error}`;
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
    return `Something went wrong: ${error}`;
  }
  if (isSuccessful) redirect("/home");
}
