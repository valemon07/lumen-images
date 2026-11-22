"use client";
import { useActionState } from "react";
import { authenticate } from "../lib/user-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginForm() {
  const [, formAction] = useActionState(authenticate, undefined);

  return (
    <form
      action={formAction}
      className="mx-auto w-full max-w-sm"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black leading-none tracking-[-0.04em]">Log in</h1>
          <p className="text-base text-muted-foreground">Enter email and password to log in.</p>
          <Link href="/signup" className="text-sm underline decoration-primary decoration-2 underline-offset-4 hover:decoration-foreground">
              Sign up
            </Link>
        </div>
        <div>
          <div className="flex flex-col gap-6">
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
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
          <Button type="submit" size="lg" className="w-full">
            Log in
          </Button>
        </div>
      </div>
    </form>
  );
}
