"use server";

import z from "zod";
import sql from "./db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { User } from "./types";
import { headers } from "next/headers";

export type UserState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

const UserSchema = z.object({
  id: z.int(),
  name: z.string(),
  email: z.email(),
  password: z.string().min(6),
});

const CreateUser = UserSchema.omit({ id: true });

export async function createUser(prevState: UserState, formData: FormData) {
  const parsedCredentials = CreateUser.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsedCredentials.success) {
    return {
      errors: parsedCredentials.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User.",
    };
  }
  // Prepare for insertion
  const { name, email, password } = parsedCredentials.data;
  const passHash = await bcrypt.hash(password, 10);

  try {
    await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passHash})
      `;
  } catch (e) {
    return {
      message: "Database Error: Failed to Create User",
    };
  }
  redirect("/home");
}

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
        callbackURL: formData.get("redirectTo")?.toString() || "/home",
      },
      asResponse: true,
    });
    isSuccessful = true;
  } catch (e) {
    return `Error - Failed to Create User: ${e}`;
  }
  if (isSuccessful) redirect("/home");
}

export async function getServerSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function getCachedUser() {
  "use cache";
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user;
}
