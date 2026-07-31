import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../loading";
import NewAlbumButton from "@/app/ui/new-album-button";
import { getCurrentUserAlbums } from "@/app/lib/actions";

export default async function Page() {
  const albums = await getCurrentUserAlbums();

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between my-4 mx-8">
        <div className="text-2xl font-medium">Albums</div>
        <NewAlbumButton />
      </div>
      <Separator />
      <Suspense fallback={<Loading />}>
        <main className="flex flex-col">
          {albums && albums.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 m-8 gap-3">
              {albums.map((album) => (
                <div key={album.album_id}>
                  <Link href={`/home/albums/${album.album_id}`}>
                    <Card className="mx-auto max-w-3xs aspect-square flex items-center justify-center text-center p-4">
                      {album.album_name}
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="m-8 text-muted-foreground">No albums yet!</div>
          )}
        </main>
      </Suspense>
    </div>
  );
}
