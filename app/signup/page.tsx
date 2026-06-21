"use client";
import { Button } from "../ui/button";
import { signUpEmail, UserState } from "../lib/user-actions";
import { useActionState } from "react";

export default function Page() {
  const initialState = "";
  const [state, formAction] = useActionState(signUpEmail, initialState);
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
