import { Separator } from "@/components/ui/separator";
import { Skeleton, SkeletonFilterBar, SkeletonImage } from "@/app/ui/skeletons";

export default function Loading() {
  return (
    <div className="w-full h-full">
      <div className="font-medium text-2xl mx-8 my-4">
        <Skeleton className="h-8 w-48" />
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