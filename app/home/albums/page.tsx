import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full h-full">
      <div className="text-2xl font-medium my-4 mx-8">Albums</div>
      <Separator />
      <main className="flex flex-col">
        <div className="grid grid-cols-5 m-8 gap-3">
          <div>
            <Link href="/home/albums/test1">
              <Card className="mx-auto aspect-square">Album 1</Card>
            </Link>
          </div>
          <div>
            <Link href="/home/albums/test2">
              <Card className="mx-auto aspect-square">Album 2</Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
