import { getAllPresignedPhotos } from "@/app/lib/actions";
import { auth } from "../lib/auth";
import { headers } from "next/headers";
import PhotoGrid from "./photo-grid";

export default async function PhotoGridContainer() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    const photosData = await getAllPresignedPhotos(session.user.id);

    if (!photosData) return <div>No images found!</div>;
    console.log("data acquired");
    return <PhotoGrid photosData={photosData} />;
  }
}
