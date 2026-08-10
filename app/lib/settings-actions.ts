"use server";

import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function changePassword(currentPassword: string, newPassword: string) {
  const result = await auth.api.changePassword({
    body: { currentPassword, newPassword, revokeOtherSessions: true },
    headers: await headers(),
  });
  return result;
}

export async function deleteAccount() {
  await auth.api.deleteUser({
    body: {},
    headers: await headers(),
  });
  redirect("/login");
}