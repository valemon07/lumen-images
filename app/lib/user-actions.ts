"use server";

import z from "zod";
import sql from "./db";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { User } from "./types";

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
  try {
    await signIn("credentials", formData, {
      redirectTo: formData.get("redirectTo")?.toString() || "/home",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid Credentials.";
        default:
          return "Something went wrong.";
      }
    }
  }
}
