import { Suspense } from "react";
import VerifyEmailClient from "./verify-email-client";

export default function VerifyEmailPage() {
  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <Suspense>
        <VerifyEmailClient />
      </Suspense>
    </main>
  );
}