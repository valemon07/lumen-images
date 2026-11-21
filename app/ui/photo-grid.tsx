"use client";
import { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { Photo, FilterState } from "../lib/types";
import PhotoCard from "./photo-card";
import { deletePhoto } from "../lib/actions";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

const SCROLL_BUFFER = 600;
const INITIAL_LOAD = 30;
const LOAD_MORE = 20;

export default function PhotoGrid(props: {
  photosData: { photos: Photo[]; urls: string[] };
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
}) {
  const { photosData, onFiltersChange, currentFilters } = props;
  const items = useMemo(
    () =>
      photosData.photos.map((photo, i) => ({
        photo,
        url: photosData.urls[i],
      })),
    [photosData.photos, photosData.urls],
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

  const handleDelete = useCallback(async (photo: Photo) => {
    try {
      if (await deletePhoto(photo)) {
        setDeletedKeys((prev) => new Set(prev).add(photo.s3_key));
        return;
      }
    } catch {
      // Network failures can reject before the server action returns a result.
    }
    toast.error("Failed to delete photo");
  }, []);

  const handleClearFilters = useCallback(() => {
    onFiltersChange({ date: { type: "all" }, tags: {} });
  }, [onFiltersChange]);

  if (photoItems.length === 0) {
    const hasActiveFilters =
      currentFilters.date.type !== "all" ||
      Object.values(currentFilters.tags).some((labels) => labels.length > 0);
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center w-full">
        <p className="text-muted-foreground">
          {hasActiveFilters ? "No images match your filters" : "No images found!"}
        </p>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="mt-2 gap-1">
            <XIcon className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>
    );
  }

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
