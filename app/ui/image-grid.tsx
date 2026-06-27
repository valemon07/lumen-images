"use client";
import { getAllPresignedImages } from "@/app/lib/actions";
import { authClient } from "@/app/lib/auth-client";
import { ImageType } from "../lib/types";
import { useState, useEffect } from "react";
import PhotoCard from "./photo-card";
import PhotoModal from "./photo-modal";

export default function ImageGrid() {
  const [session, setSession] = useState(null);
  const [imagesData, setImagesData] = useState<{
    images: ImageType[];
    urls: string[];
  }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | unknown>();
  const [focusedImage, setFocusedImage] = useState<{
    image: ImageType;
    url: string;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Get session from client-side auth
        const { data: sessionData, error } = await authClient.getSession();
        setSession(sessionData);

        if (!sessionData) {
          setError(new Error("You must be logged in to access this page."));
          setLoading(false);
          return;
        }

        const userId = sessionData.user.id;
        // Call server action to get presigned images
        const images = await getAllPresignedImages(userId);
        setImagesData(images);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError(err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col justify-center-items-center h-screen w-screen">
        {/*<SkeletonCard />*/}
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col justify-center-center h-screen w-screen">
        <div className="p-4 text-red-500">{error.message}</div>
      </main>
    );
  }

  if (!session) {
    return <div>You must be logged in to access this page.</div>;
  }

  if (!imagesData) return <div>No images found!</div>;
  const { images, urls } = imagesData;

  return (
    <div className="columns-4">
      {focusedImage && (
        <div className="fixed inset-y-0 left-0 right-0 md:left-(--sidebar-width) md:w-[calc(100vw-var(--sidebar-width))]">
          <div
            className="absolute inset-0 bg-background opacity-60 z-50"
            onClick={() => setFocusedImage(null)}
          />
          <div className="relative flex h-full items-center justify-center px-4">
            <div className="z-51">
              <PhotoModal
                src={focusedImage.url}
                alt={focusedImage.image.file_name}
                width={500}
                height={500}
                className=""
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row flex-wrap gap-4">
        {images.map((image, i) => (
          <div
            key={image.id}
            onClick={() => {
              setFocusedImage({ image: image, url: urls[i] });
            }}
          >
            <PhotoCard
              src={urls[i]}
              alt={image.file_name}
              width={250}
              height={250}
              className=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}
