"use client";
import Image from "next/image";
import { getAllPresignedImages } from "@/app/lib/actions";
import { authClient } from "@/app/lib/auth-client";
import { ImageType } from "../lib/types";
import { useState, useEffect } from "react";
import PhotoCard from "./photo-card";

export default function ImageGrid() {
  const [session, setSession] = useState(null);
  const [imagesData, setImagesData] = useState<{
    images: ImageType[];
    urls: string[];
  }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | unknown>();

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
    <main className="columns-4">
      <div className="flex flex-row flex-wrap gap-4">
        {images.map((image, i) => (
          <div key={image.id}>
            <PhotoCard
              src={urls[i]}
              alt={image.fileName}
              width={250}
              height={250}
              className="rounded-lg w-full block h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
