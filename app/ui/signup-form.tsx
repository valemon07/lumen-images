"use client";
import { useActionState } from "react";
import { signUpEmail } from "../lib/user-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignupForm() {
  const [state, formAction] = useActionState(signUpEmail, "");

  return (
    <form
      action={formAction}
      className="mx-auto w-full max-w-sm"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black leading-none tracking-[-0.04em]">Sign up</h1>
          <p className="text-base text-muted-foreground">Create your account to get started.</p>
          <Link href="/login" className="text-sm underline decoration-primary decoration-2 underline-offset-4 hover:decoration-foreground">
              Log in
            </Link>
        </div>
        <div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="user@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="No peeking!"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {state && <p className="text-sm text-destructive">{state}</p>}
          <Button type="submit" size="lg" className="w-full">
            Sign up
          </Button>
        </div>
      </div>
    </form>
  );
}
