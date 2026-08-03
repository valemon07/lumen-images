"use client";
import { Button } from "@/components/ui/button";
import { signUpEmail } from "../lib/user-actions";
import { useActionState } from "react";

export default function Page() {
  const [, formAction] = useActionState(signUpEmail, "");
  return (
    <main>
      <form
        action={formAction}
        className="flex flex-col h-screen justify-center items-center space-y-2"
      >
        <input type="text" name="name" placeholder="Enter your name" />
        <input type="email" name="email" placeholder="Enter your email" />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
        />
        <Button>Sign Up</Button>
      </form>
    </main>
  );
}
