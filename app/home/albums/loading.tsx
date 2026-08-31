import { Separator } from "@/components/ui/separator";
import { SkeletonImage } from "@/app/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between my-4 mx-8">
        <div className="text-2xl font-medium">Albums</div>
        <Skeleton className="h-9 w-32" />
      </div>
      <Separator />
      <main className="flex flex-col">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 m-8 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonImage key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
