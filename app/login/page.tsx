import { Suspense } from "react";
import LoginForm from "../ui/login-form";
import { SkeletonCard } from "../ui/skeletons";

export default function LoginPage() {
  return (
    <main className="flex flex-col h-screen space-y-4.5 justify-center items-center">
      <Suspense fallback={SkeletonCard()}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
