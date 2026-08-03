import { Separator } from "@/components/ui/separator";
import AlbumPhotos from "@/app/ui/album-photos";
import { getAlbum, getAlbumPhotos } from "@/app/lib/actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [album, photosData] = await Promise.all([
    getAlbum(id),
    getAlbumPhotos(id),
  ]);

  if (!album) {
    return (
      <div className="w-full h-full">
        <div className="font-medium text-2xl mx-8 my-4">Album not found</div>
        <Separator />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="font-medium text-2xl mx-8 my-4">{album.album_name}</div>
      <Separator />
      <main className="flex flex-col grow justify-center items-center w-auto h-auto m-8">
        {photosData ? (
          <AlbumPhotos albumId={id} photosData={photosData} />
        ) : (
          <div>No images found!</div>
        )}
      </main>
    </div>
  );
}
