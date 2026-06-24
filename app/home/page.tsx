import { Suspense } from "react";
import TestCard from "./testcomponent";
import { SkeletonCard } from "../ui/skeletons";
import { headers } from "next/headers";
import { auth } from "../lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <div>You must be logged in to access this page.</div>;
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen">
      <Suspense fallback={SkeletonCard()}>
        <TestCard session={session} />
      </Suspense>
    </main>
  );
}
