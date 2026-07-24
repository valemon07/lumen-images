import { Separator } from "@/components/ui/separator";
import PhotoUploadButton from "@/app/ui/photo-upload-button";
import PhotoGridContainer from "@/app/ui/photo-grid-container";

export default function Page() {
  return (
    <div className="w-full h-full">
      <div className="font-medium text-2xl mx-8 my-4">Photos</div>
      <Separator />
      <main className="flex flex-col grow justify-center items-center w-auto h-auto m-8">
        <div className="fixed bottom-8 right-8">
          <PhotoUploadButton />
        </div>
        <PhotoGridContainer />
      </main>
    </div>
  );
}