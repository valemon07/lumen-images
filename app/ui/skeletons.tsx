import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full" />
      </CardContent>
    </Card>
  );
}

export function SkeletonImage() {
  return <Skeleton className="aspect-square w-full" />;
}

export function SkeletonFilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Skeleton className="size-4" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Separator orientation="vertical" className="h-6" />
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-8 w-20" />
      ))}
      <Separator orientation="vertical" className="h-6" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
