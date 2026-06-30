import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-col w-full">
      <div className="grid grid-cols-5">
        <div>
          <Link href="/home/albums/test1">
            <Card className="mx-auto">Album 1</Card>
          </Link>
        </div>
        <div>test2</div>
      </div>
    </main>
  );
}
