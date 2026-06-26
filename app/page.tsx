import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <p>Lumen Start Page</p>
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <Button type="button">
          <Link href="/login">Log in</Link>
        </Button>
      </main>
    </div>
  );
}
