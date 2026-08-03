"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Photo } from "../lib/types";
import PhotoGrid from "./photo-grid";
import PhotoUploadButton from "./photo-upload-button";

export default function AlbumPhotos(props: {
  albumId: string;
  photosData: { photos: Photo[]; urls: string[] };
}) {
  const router = useRouter();

  useEffect(() => {
    const handler = () => router.refresh();
    window.addEventListener("photo-uploaded", handler);
    return () => window.removeEventListener("photo-uploaded", handler);
  }, [router]);

  return (
    <>
      <div className="fixed bottom-8 right-8">
        <PhotoUploadButton albumId={props.albumId} />
      </div>
      <PhotoGrid photosData={props.photosData} />
    </>
  );
}
