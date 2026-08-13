"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const callbackURL = searchParams.get("callbackURL") || "/home";

  const [status, setStatus] = useState<
    "verifying" | "verified" | "error" | "idle"
  >(token ? "verifying" : "idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      const { error } = await authClient.verifyEmail({
        query: { token, callbackURL },
      });
      if (cancelled) return;
      if (error) {
        setError(error.message || "Verification failed");
        setStatus("error");
      } else {
        setStatus("verified");
        setTimeout(() => router.push(callbackURL), 1500);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, callbackURL, router]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setResending(true);
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: "/home",
    });
    setResending(false);
    setError(error?.message || null);
  };

  return (
    <Card className="mx-auto w-full max-w-sm [--card-spacing:--spacing(8)]">
      <CardHeader>
        <CardTitle>
          {status === "verified"
            ? "Email Verified"
            : status === "error"
              ? "Verification Failed"
              : token
                ? "Verifying..."
                : "Check Your Email"}
        </CardTitle>
        <CardDescription>
          {status === "verified"
            ? "Your email has been verified. Redirecting..."
            : status === "error"
              ? "We could not verify your email."
              : token
                ? "Verifying your email address..."
                : "We sent you a verification link. Check your inbox to activate your account."}
        </CardDescription>
      </CardHeader>

      {(status === "idle" || status === "error") && (
        <CardContent>
          {status === "error" && !token && (
            <p className="mb-4 text-sm text-destructive">{error}</p>
          )}
          <form onSubmit={handleResend} className="flex flex-col gap-4">
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
            <Button type="submit" disabled={resending || !email.trim()}>
              {resending ? "Sending..." : "Resend Verification Email"}
            </Button>
          </form>
        </CardContent>
      )}

      <CardFooter className="flex-col gap-2">
        {token ? (
          <Button asChild variant="outline" className="w-full">
            <Link href={callbackURL}>Continue to app</Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Go to login</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}