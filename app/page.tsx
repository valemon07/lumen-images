import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <Link
          href="/login"
          className="flex items-center gap-5 self-start rounded-lg bg-yellow-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-yellow-500 md:text-base"
        >
          <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
        </Link>
      </main>
    </div>
  );
}
