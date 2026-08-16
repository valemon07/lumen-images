import { Separator } from "@/components/ui/separator";
import { SkeletonFilterBar, SkeletonImage } from "@/app/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between my-4 mx-8">
        <div className="text-2xl font-medium">Photos</div>
        <Skeleton className="h-9 w-36" />
      </div>
      <Separator />
      <SkeletonFilterBar />
      <main className="flex flex-col grow justify-center items-center w-auto h-auto m-8">
        <div className="w-full columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 *:break-inside-avoid *:mb-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonImage key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
