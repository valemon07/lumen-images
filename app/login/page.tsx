import LoginForm from "../ui/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex flex-col h-screen space-y-4.5 justify-center items-center">
      <LoginForm />
      <Link href="/signup"> Or Create an account...</Link>
    </main>
  );
}
