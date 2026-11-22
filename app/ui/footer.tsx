"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col gap-3 border-t border-border px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-16">
      <p>
        <span className="font-black text-foreground">Lumen</span> · &copy;{" "}
        {new Date().getFullYear()}
      </p>
      <nav className="flex gap-6">
        <Link href="/login" className="hover:text-foreground hover:underline">
          Log in
        </Link>
        <Link href="/signup" className="hover:text-foreground hover:underline">
          Sign up
        </Link>
      </nav>
    </footer>
  );
}
