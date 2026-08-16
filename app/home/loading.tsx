import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col grow justify-center items-center gap-3">
      <Skeleton className="h-8 w-48" />
      <div className="flex flex-row justify-center items-center gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-36" />
      </div>
    </main>
  );
}