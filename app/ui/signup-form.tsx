"use client";
import { useActionState } from "react";
import { signUpEmail } from "../lib/user-actions";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignupForm() {
  const [state, formAction] = useActionState(signUpEmail, "");

  return (
    <form
      action={formAction}
      className="mx-auto w-full max-w-sm [--card-spacing:--spacing(8)]"
    >
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
          <CardAction>
            <Link href="/login" className="hover:underline">
              Log in
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {state && <p className="text-sm text-destructive">{state}</p>}
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
