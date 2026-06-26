import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col grow justify-center items-center">
      <span>Lumen Home Page</span>
      <div className="flex flex-row justify-center items-center">
        <Button>
          <Link href="/home/photos">View All Photos</Link>
        </Button>
        <Button>
          <Link href="/home/albums"> View All Albums</Link>
        </Button>
      </div>
    </main>
  );
}
