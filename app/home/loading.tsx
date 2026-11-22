import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-foreground pb-4">
        <Skeleton className="h-9 w-48" />
      </header>
      <div className="flex flex-row flex-wrap items-center gap-3">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-36" />
      </div>
    </div>
  );
}
