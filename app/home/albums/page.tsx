import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import NewAlbumButton from "@/app/ui/new-album-button";
import { getCurrentUserAlbumsWithPreviews } from "@/app/lib/actions";

export default async function Page() {
  const albums = await getCurrentUserAlbumsWithPreviews();

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-foreground pb-4">
        <h1 className="text-3xl font-black leading-none tracking-[-0.035em] sm:text-4xl">Albums</h1>
        <NewAlbumButton />
      </header>
      {albums && albums.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {albums.map((album) => (
            <div key={album.album_id} className="flex flex-col items-start gap-3">
              <span className="inline-block max-w-full -rotate-1 truncate bg-tape px-2.5 py-0.5 font-tape text-base leading-snug text-tape-foreground">
                {album.album_name}
              </span>
              <Link
                href={`/home/albums/${album.album_id}`}
                aria-label={`Open album ${album.album_name}`}
                className="relative block aspect-square w-full bg-mount p-[6%] hover:bg-[color-mix(in_oklch,var(--mount),var(--foreground)_10%)]"
              >
                {album.previews.length > 0 ? (
                  <div
                    className={`grid h-full w-full gap-1 ${
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
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                    Empty album
                  </div>
                )}
                {album.photoCount > 3 && (
                  <span className="absolute bottom-2 right-2 bg-background p-1.5 text-foreground">
                    <Plus className="size-4" />
                  </span>
                )}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid aspect-[3/2] w-full place-items-center border-[1.5px] border-dashed border-input bg-transparent p-6 text-center text-muted-foreground">
          No albums yet. Create your first one.
        </div>
      )}
    </div>
  );
}
