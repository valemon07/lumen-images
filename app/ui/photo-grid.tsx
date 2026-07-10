"use client";
import { useCallback, useState } from "react";
import { Photo } from "../lib/types";
import PhotoCard from "./photo-card";
import { deletePhoto } from "../lib/actions";

export default function PhotoGrid(props: {
  photosData: { photos: Photo[]; urls: string[] };
}) {
  const photosData = props.photosData;
  const [photos, setPhotos] = useState<Photo[]>(photosData.photos);
  const urls = photosData.urls;

  const handleDelete = useCallback((photo: Photo) => {
    setPhotos((prev) => prev.filter((p) => p.s3_key !== photo.s3_key));
    deletePhoto(photo);
  }, []);

  if (!photosData) return <div>No images found!</div>;

  return (
    <div className="columns-4">
      <div className="flex flex-row flex-wrap gap-4">
        {photos.map((photo, i) => {
          return (
            <PhotoCard
              photoAndUrl={{ photo: photo, url: urls[i] }}
              onDelete={handleDelete}
              key={photo.s3_key}
            />
          );
        })}
      </div>
    </div>
  );
}
