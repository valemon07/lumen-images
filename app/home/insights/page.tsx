import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between my-4 mx-8">
        <div className="text-2xl font-medium">Insights</div>
      </div>
      <Separator />
      <main className="flex flex-col grow justify-center items-center w-auto h-auto m-8">
        I'm a page!
      </main>
    </div>
  );
}
