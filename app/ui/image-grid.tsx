//TODO: move authentication out of component and

import { getAllPresignedImages } from "@/app/lib/actions";
import { Photo } from "../lib/types";
import PhotoCard from "./photo-card";
import { auth } from "../lib/auth";
import { headers } from "next/headers";

export default async function ImageGrid() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const photosData = await getAllPresignedImages(session.user.id);

    if (!photosData) return <div>No images found!</div>;
    const { photos, urls } = photosData;
    console.log(photosData);
    return (
      <div className="columns-4">
        <div className="flex flex-row flex-wrap gap-4">
          {photos.map((photo, i) => {
            return (
              <PhotoCard
                photoAndUrl={{ photo: photo, url: urls[i] }}
                key={photo.s3_key}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
