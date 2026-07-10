import ImageGrid from "@/app/ui/image-grid";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import Loading from "../loading";
import ImageUploadButton from "@/app/ui/image-upload-button";

export default function Page() {
  return (
    <div className="w-full h-full">
      <div className="font-medium text-2xl mx-8 my-4">Photos</div>
      <Separator />
      <Suspense fallback={<Loading />}>
        <main className="flex flex-col grow justify-center items-center w-auto h-auto m-8">
          <ImageGrid />
          <div className="fixed bottom-8 right-8">
            <ImageUploadButton />
          </div>
        </main>
      </Suspense>
    </div>
  );
}
