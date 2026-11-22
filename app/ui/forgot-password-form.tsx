"use client";
import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error, data } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    setLoading(false);
    if (error) setError(error.message || "Something went wrong");
    else setMessage(data.message || "Check your email for the reset link");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-sm"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black leading-none tracking-[-0.04em]">Forgot Password</h1>
          <p className="text-base text-muted-foreground">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
          <Link href="/login" className="text-sm underline decoration-primary decoration-2 underline-offset-4 hover:decoration-foreground">
              Back to login
            </Link>
        </div>
        <div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={loading || !email.trim()}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </div>
    </form>
  );
}