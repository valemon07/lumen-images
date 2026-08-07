import { Separator } from "@/components/ui/separator";
import NewPhotoButton from "@/app/ui/new-photo-button";
import PhotoGridContainer from "@/app/ui/photo-grid-container";

export default function Page() {
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between my-4 mx-8">
        <div className="text-2xl font-medium">Photos</div>
        <NewPhotoButton />
      </div>
      <Separator />
      <main className="flex flex-col grow justify-center items-center w-auto h-auto m-8">
        <PhotoGridContainer />
      </main>
    </div>
  );
}
