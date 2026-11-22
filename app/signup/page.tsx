import SignupForm from "../ui/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="px-4 py-5 sm:px-8 lg:px-16">
        <Link href="/" className="text-2xl font-black tracking-tight">
          Lumen
        </Link>
      </header>
      <div className="mx-auto mt-16 w-full max-w-sm px-4 pb-16">
        <SignupForm />
      </div>
    </main>
  );
}
