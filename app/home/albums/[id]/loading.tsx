import { SkeletonFilterBar, SkeletonImage } from "@/app/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-foreground pb-4">
        <Skeleton className="h-9 w-48" />
      </header>
      <SkeletonFilterBar />
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonImage key={i} />
        ))}
      </div>
    </div>
  );
}
