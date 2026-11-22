import AlbumPhotosClient from "./album-photos-client";
import { getAlbum } from "@/app/lib/actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const album = await getAlbum(id);

  if (!album) {
    return (
      <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-foreground pb-4">
          <h1 className="text-3xl font-black leading-none tracking-[-0.035em] sm:text-4xl">Album not found</h1>
        </header>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-foreground pb-4">
        <h1 className="text-3xl font-black leading-none tracking-[-0.035em] sm:text-4xl">{album.album_name}</h1>
      </header>
      <div className="flex w-full flex-col gap-6">
        <AlbumPhotosClient albumId={id} />
      </div>
    </div>
  );
}