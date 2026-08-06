import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Footer from "@/app/ui/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      <header className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold tracking-tight">Lumen</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Upload your images. Get AI insights.
        </p>
        <p className="mt-4 text-base text-muted-foreground">
          Lumen analyzes your photos with AI to extract meaningful information,
          detect objects, and provide intelligent descriptions.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </header>
      <Suspense
        fallback={
          <p className="w-full max-w-2xl text-center py-8 text-sm text-muted-foreground animate-pulse">
            &copy; 2026 Lumen. All rights reserved.
          </p>
        }
      >
        <Footer />
      </Suspense>
    </div>
  );
}
