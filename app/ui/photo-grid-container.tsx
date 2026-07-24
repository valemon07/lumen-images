"use client";
import { useEffect, useState } from "react";
import { getCurrentUserPhotos } from "@/app/lib/actions";
import { Photo } from "../lib/types";
import PhotoGrid from "./photo-grid";
import { SkeletonImage } from "./skeletons";

export default function PhotoGridContainer() {
  const [data, setData] = useState<{
    photos: Photo[];
    urls: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getCurrentUserPhotos().then((result) => {
      if (cancelled) return;
      setData(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 [&>*]:break-inside-avoid [&>*]:mb-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <SkeletonImage key={i} />
        ))}
      </div>
    );
  }

  if (!data) return <div>No images found!</div>;
  return <PhotoGrid photosData={data} />;
}