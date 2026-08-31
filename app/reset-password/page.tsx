import { Suspense } from "react";
import ResetPasswordClient from "./reset-password-client";

export default function ResetPasswordPage() {
  return (
    <main className="flex flex-col h-screen justify-center items-center">
      <Suspense>
        <ResetPasswordClient />
      </Suspense>
    </main>
  );
}