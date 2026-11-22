import { Suspense } from "react";
import ResetPasswordClient from "./reset-password-client";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="px-4 py-5 sm:px-8 lg:px-16">
        <Link href="/" className="text-2xl font-black tracking-tight">
          Lumen
        </Link>
      </header>
      <div className="mx-auto mt-16 w-full max-w-sm px-4 pb-16">
        <Suspense>
          <ResetPasswordClient />
        </Suspense>
      </div>
    </main>
  );
}
