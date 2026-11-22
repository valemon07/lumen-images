import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-foreground pb-4">
        <h1 className="text-3xl font-black leading-none tracking-[-0.035em] sm:text-4xl">Home</h1>
      </header>
      <p className="text-base text-muted-foreground">
        Pick up where you left off.
      </p>
      <div className="flex flex-row flex-wrap items-center gap-3">
        <Button>
          <Link href="/home/photos">View All Photos</Link>
        </Button>
        <Button>
          <Link href="/home/albums"> View All Albums</Link>
        </Button>
      </div>
    </div>
  );
}
