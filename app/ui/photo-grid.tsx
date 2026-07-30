"use client";
import { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { Photo } from "../lib/types";
import PhotoCard from "./photo-card";
import { deletePhoto } from "../lib/actions";

const SCROLL_BUFFER = 600;
const INITIAL_LOAD = 30;
const LOAD_MORE = 20;

export default function PhotoGrid(props: {
  photosData: { photos: Photo[]; urls: string[] };
}) {
  const items = useMemo(
    () =>
      props.photosData.photos.map((photo, i) => ({
        photo,
        url: props.photosData.urls[i],
      })),
    [props.photosData.photos, props.photosData.urls],
  );

  const [deletedKeys, setDeletedKeys] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);

  const photoItems = useMemo(
    () => items.filter((item) => !deletedKeys.has(item.photo.s3_key)),
    [items, deletedKeys],
  );

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) =>
            Math.min(prev + LOAD_MORE, photoItems.length),
          );
        }
      },
      { rootMargin: `${SCROLL_BUFFER}px` },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [photoItems.length]);

  const handleDelete = useCallback((photo: Photo) => {
    setDeletedKeys((prev) => new Set(prev).add(photo.s3_key));
    deletePhoto(photo);
  }, []);

  if (photoItems.length === 0) return <div>No images found!</div>;

  const visibleItems = photoItems.slice(0, visibleCount);
  const count = visibleItems.length;
  const cols =
    count <= 3
      ? "columns-1 sm:columns-2 md:columns-3"
      : count <= 8
        ? "columns-2 sm:columns-3 md:columns-4"
        : "columns-2 sm:columns-3 md:columns-4 lg:columns-5";

  return (
    <div className={`w-full ${cols} gap-4 *:break-inside-avoid *:mb-4`}>
      {visibleItems.map(({ photo, url }) => (
        <PhotoCard
          photoAndUrl={{ photo, url }}
          onDelete={handleDelete}
          key={photo.s3_key}
        />
      ))}
      {visibleCount < photoItems.length && (
        <div ref={sentinelRef} className="h-4" />
      )}
    </div>
  );
}
