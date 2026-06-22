import { Suspense } from "react";
import TestCard from "./testcomponent";
import { SkeletonCard } from "../ui/skeletons";

export default async function Page() {
  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen">
      <Suspense fallback={SkeletonCard()}>
        <TestCard />
      </Suspense>
    </main>
  );
}
