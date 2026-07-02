import ImageGrid from "@/app/ui/image-grid";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="w-full h-full">
      <div className="font-medium text-2xl mx-8 my-4">Photos</div>
      <Separator />
      <main className="flex flex-col grow justify-center items-center w-auto h-auto m-8">
        <ImageGrid />
      </main>
    </div>
  );
}
