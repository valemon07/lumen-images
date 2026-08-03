import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import Loading from "../loading";
import NewAlbumButton from "@/app/ui/new-album-button";
import { getCurrentUserAlbumsWithPreviews } from "@/app/lib/actions";

export default async function Page() {
  const albums = await getCurrentUserAlbumsWithPreviews();

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
                    <Card className="relative max-w-3xs aspect-square overflow-hidden">
                      {album.previews.length > 0 ? (
                        <div
                          className={`grid h-full w-full gap-1 p-4 ${
                            album.previews.length === 1
                              ? "grid-cols-1"
                              : album.previews.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-3"
                          }`}
                        >
                          {album.previews.map(({ photo, url }) => (
                            <div key={photo.s3_key} className="relative">
                              <Image
                                src={url}
                                alt={photo.file_name}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                className="object-cover rounded-2xl"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center p-4 text-center">
                          {album.album_name}
                        </div>
                      )}
                      {album.previews.length > 0 && (
                        <span className="absolute bottom-2 left-2 max-w-[calc(100%-4rem)] truncate rounded-md bg-background/80 px-2 py-1 text-sm font-medium">
                          {album.album_name}
                        </span>
                      )}
                      {album.photoCount > 3 && (
                        <span className="absolute bottom-2 right-2 rounded-full bg-background/80 p-1.5">
                          <Plus className="size-4" />
                        </span>
                      )}
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
